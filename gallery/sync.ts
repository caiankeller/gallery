import fs from "node:fs/promises";
import path from "node:path";
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
	whitelistCameraSettings: [
		"WhiteBalance",
		"FocalLength",
		"ExposureTime",
		"ISOSpeedRatings",
		"LightSource",
		"FNumber",
	],
};

const allowedKeys = new Set(CONFIG.whitelistCameraSettings);

export async function loadManifest(
	manifestPath: string,
): Promise<IGalleryManifest> {
	try {
		const raw = await fs.readFile(manifestPath, "utf-8");
		const json = JSON.parse(raw);

		const result = GalleryManifestSchema.safeParse(json);

		if (!result.success) {
			console.warn("Existing manifest has invalid data. Starting a fresh one.");
			return [];
		}

		return result.data;
	} catch {
		console.log("No existing manifest found. Creating a fresh one.");
		return [];
	}
}

async function syncManifest() {
	try {
		await fs.access(CONFIG.photosDir).catch(() => {
			throw new Error(`Photos directory missing at ${CONFIG.photosDir}`);
		});

		const existingData = await loadManifest(CONFIG.manifestPath);

		const allFiles = await fs.readdir(CONFIG.photosDir);
		const filesOnDisk = allFiles.filter((file) =>
			CONFIG.imageExtensions.has(path.extname(file).toLowerCase()),
		);

		const updatedGallery = await Promise.all(
			filesOnDisk.map(async (file): Promise<IGalleryItem | null> => {
				const existingEntry = existingData.find(
					(item) => item.filename === file,
				);

				if (existingEntry) {
					return existingEntry;
				}

				const filePath = path.join(CONFIG.photosDir, file);
				try {
					const image = sharp(filePath);
					const metadata = await image.metadata();

					let camera = settings.device || "Unknown Device";
					let cameraSettings: IGalleryItem["cameraSettings"] = null;

					if (metadata.exif) {
						try {
							const exif = exifReader(metadata.exif);

							const make = exif.Image?.Make?.trim();
							const model = exif.Image?.Model?.trim();
							const parts = [make, model].filter(Boolean);
							if (parts.length) camera = parts.join(" ");

							if (exif.Photo) {
								const filtered = Object.fromEntries(
									Object.entries(exif.Photo).filter(([key]) =>
										allowedKeys.has(key),
									),
								);

								if (Object.keys(filtered).length) {
									cameraSettings = filtered;
								}
							}
						} catch (exifError) {
							console.warn(`Could not parse EXIF for ${file}: \n`, exifError);
						}
					}

					return {
						id: nanoid(),
						filename: file,
						width: metadata.width,
						height: metadata.height,
						camera,
						date: new Date().toISOString(),
						cameraSettings,
						caption: "",
					};
				} catch (err) {
					console.error(
						`❌ Skipping ${file}: Not a valid image or corrupted. \n`,
						err,
					);
					return null;
				}
			}),
		);

		const cleanGallery = updatedGallery.filter((item): item is IGalleryItem => {
			return item !== null && filesOnDisk.includes(item.filename);
		});

		const finalValidatedData = GalleryManifestSchema.parse(cleanGallery);

		await fs.writeFile(
			CONFIG.manifestPath,
			JSON.stringify(finalValidatedData, null, 2),
		);

		console.log(
			`Successfully synced ${finalValidatedData.length.toLocaleString("en-US")} images!`,
		);
	} catch (error) {
		console.error("Critical Sync Error: \n", error);
		process.exit(1);
	}
}

syncManifest();
