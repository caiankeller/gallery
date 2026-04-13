import type { ISettings } from "./settings.schema";

/**
 * Project settings
 * * This file serves as the single source of truth for your portfolio/gallery
 * Adjusting these values will update your headlines, metadata, and
 * image-syncing fallbacks automatically
 *
 * You can change this project in anyway, but those help creating an okay experience
 * very easily
 */
const settings: ISettings = {
	/**
	 * The primary display name used in the site headline and metadata
	 */
	name: "Caian Keller",

	/**
	 * Default camera device
	 * Used by the sync script as a fallback when EXIF data is missing
	 * If left empty, the system defaults to "Unknown Device", so think cautious about filling
	 * it or not
	 */
	device: "motorola moto g04s",

	/**
	 * Default license
	 * Fallback to avoid adding a license manually to every single image
	 * This will be applied to all synced images unless overridden in the manifest
	 * CC0 stands for public domain. Use the table below if confused:
	 	* CC0 (Public Domain)      No rights reserved. Use it for anything without credit.
		* CC BY (Attribution)      You must credit the creator.
		* CC BY-SA (ShareAlike)    Credit the creator and share under the same license.
		* CC BY-NC (Non-Commercial) No business or profit-making purposes.
		* CC BY-ND (No-Derivatives) No editing, cropping, or transformations.
	
	 * Be aware that at the end of the day, i have no clue how image licenses work in reality!
	 * You can also set this at the album level if you need different licenses for specific groups
	 */
	defaultLicense: "CC0",
	showLicense: false,

	/**
	 * Anyway, set this to true so the Metadata is completely hidden
	 */
	hideMetadata: true,

	/**
	 * A short aesthetic statement or bio displayed under the headline.
	 * Plain text, brief descriptions of your creative philosophy or whatever you feel like saying
	 */
	motto: "Bringing wabi sabi to photography",

	/**
	 * Contact email
	 * Displayed alongside social links.
	 * If null or empty, the email section will be automatically hidden from the UI
	 */
	email: "iam@caiankeller.com",

	/**
	 * Social Profiles
	 * Provide full URLs to your profiles. Setting a key to `null`
	 * prevents that specific icon/link from rendering.
	 */
	social: {
		pinterest: "https://br.pinterest.com/caiankeller/_profile/_created/",
		github: "https://github.com/caiankeller",
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
