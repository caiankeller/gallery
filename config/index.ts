import { settingsSchema } from "./settings.schema.ts";
import rawSettings from "./settings.ts";

export const settings = settingsSchema.parse(rawSettings);
