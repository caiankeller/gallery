import fs from "node:fs/promises";
import path from "node:path";
import chalk from "chalk";
import exifReader from "exif-reader";
import { nanoid } from "nanoid";
import sharp from "sharp";
import type z from "zod";
import { settings } from "@/config";
import {
	AlbumMetadataSchema,
	GalleryManifestSchema,
	type IGalleryItem,
} from "./gallery.schema";

const IMAGES_DIR = "./gallery/images";
const IMAGES_OUTPUT_DIR = "./public/images";
const MANIFEST_PATH = "./gallery/manifest.json";
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const EXIF_WHITELIST = new Set([
	"WhiteBalance",
	"FocalLength",
	"ExposureTime",
	"ISOSpeedRatings",
	"LightSource",
	"FNumber",
]);

type TAlbumMetadata = z.infer<typeof AlbumMetadataSchema>;

type IFile = {
	file: string;
	album: TAlbumMetadata;
};

type AlbumGroup = {
	album: string;
	description?: string | null;
	images: IGalleryItem[];
};

type GalleryManifest = {
	all: IGalleryItem[];
	albums: AlbumGroup[];
};

async function main() {
	await fs.mkdir(IMAGES_OUTPUT_DIR, { recursive: true });

	const existing = await loadManifest();
	const allFiles = await collectImageFiles();
	const items: IGalleryItem[] = [];

	for (const { file, album } of allFiles) {
		const cached = existing.all.find((i) => i.sourcePath === file);

		if (cached) {
			items.push(cached);
			continue;
		}

		console.log(chalk.yellow(`Processing new image: ${file}`));
		const item = await processFile(file, album);
		if (item) items.push(item);
	}

	const currentOutputFilenames = new Set(items.map((i) => i.filename));
	try {
		const outputFiles = await fs.readdir(IMAGES_OUTPUT_DIR);
		for (const file of outputFiles) {
			if (!currentOutputFilenames.has(file)) {
				await fs.unlink(path.join(IMAGES_OUTPUT_DIR, file)).catch(() => null);
				console.log(chalk.dim(`Deleted orphaned file: ${file}`));
			}
		}
	} catch (err) {
		console.error("Cleanup failed", err);
	}

	const manifest: GalleryManifest = {
		all: items,
		albums: groupByAlbum(items),
	};

	await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

	const added = items.filter(
		(i) => !existing.all.some((ex) => ex.sourcePath === i.sourcePath),
	).length;

	const deleted = existing.all.filter(
		(ex) => !items.some((i) => i.sourcePath === ex.sourcePath),
	).length;

	console.log(`\n${chalk.blue.bold("Sync Complete")}`);
	console.log(`Total: ${chalk.bold(items.length)} images`);
	console.log(`${chalk.green.bold(added)} added`);
	console.log(`${chalk.red.bold(deleted)} removed from manifest`);
}

async function loadManifest(): Promise<GalleryManifest> {
	try {
		const raw = await fs.readFile(MANIFEST_PATH, "utf-8");
		return GalleryManifestSchema.parse(JSON.parse(raw));
	} catch {
		return { all: [], albums: [] };
	}
}

function groupByAlbum(files: IGalleryItem[]): AlbumGroup[] {
	const map: Record<string, AlbumGroup> = {};

	for (const file of files) {
		const { title, description } = file.album;

		map[title] ??= {
			album: title,
			description,
			images: [],
		};

		map[title].images.push(file);
	}

	return Object.values(map);
}

async function collectImageFiles() {
	const results: IFile[] = [];

	const entries = await fs.readdir(IMAGES_DIR, { withFileTypes: true });

	const folders = [
		".",
		...entries
			.filter((entry) => entry.isDirectory())
			.map((entry) => entry.name),
	];

	for (const folder of folders) {
		const folderPath =
			folder === "." ? IMAGES_DIR : path.join(IMAGES_DIR, folder);

		let album: TAlbumMetadata;

		try {
			const raw = await fs.readFile(
				path.join(folderPath, "album.json"),
				"utf-8",
			);
			album = AlbumMetadataSchema.parse(JSON.parse(raw));
		} catch {
			continue;
		}

		const folderFiles = await fs.readdir(folderPath);

		for (const file of folderFiles) {
			const fullPath = path.join(folderPath, file);

			const stat = await fs.stat(fullPath);
			if (!stat.isFile()) continue;

			if (IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase())) {
				results.push({
					file: folder === "." ? file : `${folder}/${file}`,
					album,
				});
			}
		}
	}

	return results;
}

async function processFile(
	file: string,
	album: TAlbumMetadata,
): Promise<IGalleryItem | null> {
	const sourcePath = path.join(IMAGES_DIR, file);
	const id = nanoid();
	const outputFilename = `${id}.webp`;
	const outputPath = path.join(IMAGES_OUTPUT_DIR, outputFilename);

	try {
		if (file.endsWith(".webp")) {
			await fs.copyFile(sourcePath, outputPath);
		} else {
			await sharp(sourcePath)
				.resize({ width: 1600, withoutEnlargement: true })
				.webp({ quality: 80 })
				.toFile(outputPath);
		}

		return await buildItem(file, outputFilename, outputPath, album);
	} catch (err) {
		console.error(chalk.red(`Failed to process "${file}":`), err);
		return null;
	}
}

async function buildItem(
	originalRelPath: string,
	outputFilename: string,
	fullOutputPath: string,
	album: TAlbumMetadata,
) {
	const image = sharp(fullOutputPath);
	const metadata = await image.metadata();
	const stat = await fs.stat(fullOutputPath);

	let camera = settings.device ?? "Unknown Device";
	let capturedAt: Date = stat.mtime;
	let cameraSettings: Record<string, unknown> | undefined;

	if (metadata.exif) {
		try {
			const exif = exifReader(metadata.exif);
			const make = exif?.Image?.Make?.trim();
			const model = exif?.Image?.Model?.trim();
			if (make || model) camera = [make, model].filter(Boolean).join(" ");
			if (exif?.Image?.DateTime) capturedAt = new Date(exif.Image.DateTime);

			const exifSettings: Record<string, unknown> = {};
			for (const [key, value] of Object.entries(exif?.Photo ?? {})) {
				if (EXIF_WHITELIST.has(key)) exifSettings[key] = value;
			}
			if (Object.keys(exifSettings).length) {
				cameraSettings = exifSettings;
			}
		} catch (err) {
			console.log(`EXIF parsing failed: \n ${err}`);
		}
	}

	return {
		id: outputFilename.replace(".webp", ""),
		sourcePath: originalRelPath,
		filename: outputFilename,
		width: metadata.width,
		height: metadata.height,
		camera,
		date: capturedAt.toString(),
		cameraSettings,
		license: album.license || settings.defaultLicense,
		caption: "",
		album,
	};
}

main();
