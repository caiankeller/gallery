import { z } from "zod";
import settings from "../config/settings.ts";

export const LicenseSchema = z.enum([
	"ALL_RIGHTS_RESERVED",
	"CC_BY",
	"CC_BY_NC",
	"CC0",
	"COMMERCIAL",
]);

export const AlbumMetadataSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	license: LicenseSchema.default("CC0"),
});

export const CameraSettingsSchema = z
	.object({
		WhiteBalance: z.union([z.string(), z.number()]).optional(),
		FocalLength: z.number().optional(),
		ExposureTime: z.number().optional(),
		ISOSpeedRatings: z.number().optional(),
		LightSource: z.union([z.string(), z.number()]).optional(),
		FNumber: z.number().optional(),
	})
	.optional();

export const GalleryItemSchema = z.object({
	id: z.string(),
	filename: z.string(),
	width: z.number().optional(),
	height: z.number().optional(),
	album: AlbumMetadataSchema,
	camera: z.string(),
	date: z.string(),
	cameraSettings: CameraSettingsSchema,
	sourcePath: z.string(),
	caption: z.string().default(""),
	license: LicenseSchema.default(settings.defaultLicense),
});

export const AlbumGroupSchema = z.object({
	album: z.string(),
	description: z.string().optional(),
	images: z.array(GalleryItemSchema),
});

export const GalleryManifestSchema = z.object({
	all: z.array(GalleryItemSchema),
	albums: z.array(AlbumGroupSchema),
});

export type IGalleryItem = z.infer<typeof GalleryItemSchema>;

export type IAlbumGroup = z.infer<typeof AlbumGroupSchema>;

export type IGalleryManifest = z.infer<typeof GalleryManifestSchema>;
