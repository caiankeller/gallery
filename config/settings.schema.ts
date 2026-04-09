import { z } from "zod";

const url = z.string().url().trim();
const optionalUrl = url
	.nullable()
	.or(z.literal(""))
	.transform((v) => v || null);

export const settingsSchema = z.object({
	name: z.string(),
	motto: z.string().nullable(),
	device: z.string().nullable(),
	hideMetadata: z.boolean(),

	email: z.string().trim(),

	social: z.object({
		pinterest: optionalUrl,
		github: optionalUrl,
		instagram: optionalUrl,
		unsplash: optionalUrl,
		behance: optionalUrl,
	}),

	CTA: z
		.object({
			label: z.string().trim().min(1),
			url: url,
		})
		.nullable(),
});

export type ISettings = z.infer<typeof settingsSchema>;
