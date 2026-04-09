import { z } from "zod";

export const CameraSettingsSchema = z
	.object({
		WhiteBalance: z.union([z.string(), z.number()]).optional(),
		FocalLength: z.number().optional(),
		ExposureTime: z.number().optional(),
		ISOSpeedRatings: z.number().optional(),
		LightSource: z.union([z.string(), z.number()]).optional(),
		FNumber: z.number().optional(),
	})
	.nullable();

export const GalleryItemSchema = z.object({
	id: z.string(),
	filename: z.string(),
	width: z.number().optional(),
	height: z.number().optional(),
	camera: z.string(),
	date: z.string().datetime(),
	cameraSettings: CameraSettingsSchema,
	caption: z.string().default(""),
});

export const GalleryManifestSchema = z.array(GalleryItemSchema);

export type IGalleryItem = z.infer<typeof GalleryItemSchema>;
export type IGalleryManifest = z.infer<typeof GalleryManifestSchema>;
