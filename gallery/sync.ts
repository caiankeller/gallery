import fs from "node:fs/promises";
import path from "node:path";
import chalk from "chalk";
import exifReader from "exif-reader";
import { nanoid } from "nanoid";
import sharp from "sharp";
import { settings } from "@/config";
import {
	GalleryManifestSchema,
	type IGalleryItem,
	type IGalleryManifest,
} from "./gallery.schema";

const CONFIG = {
	photosDir: "./public/photos",
	manifestPath: "./gallery/manifest.json",
	imageExtensions: new Set([".jpg", ".jpeg", ".png", ".webp"]),
	whitelistCameraSettings: new Set([
		"WhiteBalance",
		"FocalLength",
		"ExposureTime",
		"ISOSpeedRatings",
		"LightSource",
		"FNumber",
	]),
};

export async function loadManifest(
	manifestPath: string,
): Promise<IGalleryManifest> {
	try {
		const raw = await fs.readFile(manifestPath, "utf-8");
		const json = JSON.parse(raw);

		const result = GalleryManifestSchema.safeParse(json);
		if (!result.success) {
			console.warn(
				chalk.yellow.bold(
					"Warning: manifest failed validation, treating as empty.",
				),
				result.error.format(),
			);
			return [];
		}
		return result.data;
	} catch {
		return [];
	}
}

async function syncManifest(config: typeof CONFIG) {
	const [existingData, files] = await Promise.all([
		loadManifest(config.manifestPath),
		fs.readdir(config.photosDir).then((f) => f.filter(isImage)),
	]);

	// removed Promises.all beucause some were scared of race conditions with nanoid() (really!)
	const items: IGalleryItem[] = [];
	for (const file of files) {
		const item = await processFile(file, existingData);
		if (item) {
			items.push(item);
		}
	}

	const validated = GalleryManifestSchema.parse(items);

	await fs.writeFile(config.manifestPath, JSON.stringify(validated, null, 2));

	const stats = calculateStats(existingData, files, validated.length);
	console.log(`Synced ${chalk.blue.bold(stats.total)} images`);
	console.log(`${chalk.red.bold(stats.deleted)} deleted images`);
	console.log(`${chalk.green.bold(stats.added)} added images`);
}

function calculateStats(
	existing: IGalleryItem[],
	currentFiles: string[],
	total: number,
) {
	const existingNames = new Set(existing.map((i) => i.filename));
	const currentNames = new Set(currentFiles);

	return {
		total,
		added: currentFiles.filter((f) => !existingNames.has(f)).length,
		deleted: existing.filter((i) => !currentNames.has(i.filename)).length,
	};
}

syncManifest(CONFIG);

async function processFile(
	file: string,
	existingData: IGalleryManifest,
): Promise<IGalleryItem | null> {
	const existing = existingData.find((i) => i.filename === file);
	if (existing) return existing;

	const sourcePath = path.join(CONFIG.photosDir, file);

	const { filename, filePath: outputPath } = buildOutputPaths(nanoid());

	try {
		if (isWebp(file)) {
			await fs.rename(sourcePath, outputPath);
		} else {
			await sharp(sourcePath)
				.resize({ width: 1600, withoutEnlargement: true })
				.webp({ quality: 80 })
				.toFile(outputPath);

			await fs.access(outputPath);
			await fs.unlink(sourcePath);
		}

		return buildItem(filename, outputPath);
	} catch (err) {
		console.error(chalk.red(`Failed to process "${file}", skipping:`), err);

		await fs.unlink(outputPath).catch(() => null);
		return null;
	}
}

async function buildItem(
	filename: string,
	filePath: string,
): Promise<IGalleryItem> {
	const image = sharp(filePath);
	const metadata = await image.metadata();
	const stats = await fs.stat(filePath);

	const exif = extractExif(metadata);

	return {
		id: filename.replace(".webp", ""),
		filename,
		width: metadata.width,
		height: metadata.height,
		camera: exif.camera ?? settings.device ?? "Unknown Device",
		date: (exif.capturedAt ?? stats.mtime).toString(),
		cameraSettings: exif.cameraSettings ?? null,
		caption: "",
	};
}

const isImage = (file: string) =>
	CONFIG.imageExtensions.has(path.extname(file).toLowerCase());

const isWebp = (file: string) => file.endsWith(".webp");

const buildOutputPaths = (id: string) => ({
	filename: `${id}.webp`,
	filePath: path.join(CONFIG.photosDir, `${id}.webp`),
});

const extractExif = (metadata: sharp.Metadata) => {
	if (!metadata.exif) return {};

	try {
		const exif = exifReader(metadata.exif);

		const capturedAt = exif?.Image?.DateTime;

		const make = exif?.Image?.Make?.trim();
		const model = exif?.Image?.Model?.trim();
		const camera = [make, model].filter(Boolean).join(" ") || undefined;

		const cameraSettings = Object.fromEntries(
			Object.entries(exif?.Photo ?? {}).filter(([key]) =>
				CONFIG.whitelistCameraSettings.has(key),
			),
		);

		return {
			capturedAt,
			camera,
			cameraSettings: Object.keys(cameraSettings).length
				? cameraSettings
				: null,
		};
	} catch {
		return {};
	}
};
