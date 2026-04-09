import type { ISettings } from "./settings.schema";

/**
 * Project settings
 * * This file serves as the single source of truth for your portfolio/gallery
 * Adjusting these values will update your headlines, metadata, and
 * photo-syncing fallbacks automatically
 *
 * You can change this project in anyway, but those help creating an okay experience
 * very easily
 */
const settings: ISettings = {
	/**
	 * The primary display name used in the site headline and metadata
	 */
	name: "John Doe",

	/**
	 * Default camera device
	 * Used by the sync script as a fallback when EXIF data is missing
	 * If left empty, the system defaults to "Unknown Device", so think cautious about filling
	 * it or not
	 */
	device: null,
	/**
	 * Anyway, set this to true so the Metadata is completely hidden
	 */
	hideMetadata: false,

	/**
	 * A short aesthetic statement or bio displayed under the headline.
	 * Plain text, brief descriptions of your creative philosophy or whatever you feel like saying
	 */
	motto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

	/**
	 * Contact email
	 * Displayed alongside social links.
	 * If null or empty, the email section will be automatically hidden from the UI
	 */
	email: "johndoe@email.com",

	/**
	 * Social Profiles
	 * Provide full URLs to your profiles. Setting a key to `null`
	 * prevents that specific icon/link from rendering.
	 */
	social: {
		pinterest: null,
		github: null,
		instagram: null,
		unsplash: null,
		behance: null,
	},

	/**
	 * Call to action (Custom Button)
	 * Provides a flexible link for commercial purposes (e.g., Shop, Booking).
	 * Set whole thing to null, in case you have nothing to show
	 */
	CTA: {
		label: "Check my other projects", // e.g., "Buy Prints"
		url: "https://caiankeller.com", // e.g., "https://shop.caiankeller.com"
	},
};

export default settings;
