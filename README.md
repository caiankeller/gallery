# Gallery

A lightweight, self-hosted photo gallery built with Next.js and React. Designed for simplicity and independence, it functions with zero external services.

[click here for deployed demo](https://photos.caiankeller.com)

- For the tech-savvy: I don't assume you're dumb, but I’ve written these docs to be kinda accessible.
- For the curious: You can pull that off, keep reading.

### Why this exists

I built this as a 4-hour birthday project because I wanted a way to own my pictures without relying on third-party platforms or social media. I don’t even have an Instagram, and I believe everyone should have a hassle-free way to host their own memories/work. This repo is designed to be accessible even to those with minimal technical knowledge, allowing you to get a gallery up and running in minutes.

### How to Use It

#### Configuration

The [settings](/config/settings.ts) file allows you to customize the UI to match your information. Review the variables in that file to get started. You can adventure yourself into changing the code as you'd like, but this provides a great start to anyone that just want their name and a website online, that is truly yours.

##### Customizing your branding (Favicons)

By default, this repository uses my personal branding. To make the site more like you, replace the icon files in the [/app](/app/) folder:

- favicon.ico, favicon-16x16.png, favicon-32x32.png
- apple-touch-icon.png
- android-chrome-192x192.png, android-chrome-512x512.png

Simply delete my files and drag in your own with the same filenames. Note that browsers are very stubborn about caching favicons. If you don't see your new logo immediately, try clearing your browser cache or opening the site in an Incognito/Private window.

While only the favicon.ico is strictly essential, the other files ensure your brand looks sharp on home screens and high-res mobile tabs.

#### Adding Images

The gallery structure begins in `gallery/images/`. Every directory (including the root) should contain an `album.json` file like the following:

```json
{
  "title": "Board",
  "description": "Optional description",
  "license": "CC0"
}
```

This defines the album's metadata and the license applied to its contents. You can drop your images into the root (which I use as a general album, aggrouping anything that doesn't have a defined category) or organize them into folders, which is how albums work:

##### Creating albums

To create an album, simply create a folder inside `gallery/images/` and include an `album.json`. While folder names are flexible, using **slugified** names (e.g., `my-summer-trip`) is recommended.

##### Pinning images

To pin an image so it appears in the special **Pinned** UI section, prefix the filename with an asterisk (e.g., `*photo.jpg`). The sync process will recognize this flag while keeping the image in its original album. No pinned images, no empty pinned album

-----

### Sync

#### Sync the manifest

Once your images are organized, run the sync command:

```bash
npm run sync
```

This generates a public manifest and processes your images into **WebP** format—reducing storage and bandwidth usage by roughly **60%**. This process is non-destructive and will not alter your original files.

#### Run the application (and test)

Install the dependencies and start the development server:

```bash
npm install
npm run dev
```

This should have no problem at all, but if you need support, you can [e-mail me](mailto:dev@caiankeller.com), or [create an issue](https://github.com/caiankeller/gallery/issues).

### Deploying

There are several ways to put this online. I’ll be adding detailed guides for various platforms soon, but here is the quickest path:

I personally recommend [Vercel](https://vercel.com). If you have even a little technical knowledge, it’s fast, free, and works great out of the box. It automatically pushes your images to a global CDN, ensuring your gallery loads quickly for anyone, anywhere.

#### Limitations with Vercel

While Vercel is powerful, the free tier has specific invisible walls you should know about:

- Vercel generally limits the build output to around 150MB. If you try to deploy a massive library of high-res photos all at once, the deployment might fail.

- Vercel has limits on "Image Optimization" units (how many images it processes and caches). For a personal gallery, you should be fine, but a massive spike in popularity might hit these caps.

- I highly recommend not adding a credit card to your account. Keeping it on the Hobby tier ensures you never get hit with unexpected charges. The worst case scenario, the site deploy stops, until your usage resets.

Why keep it free? If you have to pay $20/month just to host your photos, it defeats the purpose of an independent, accessible gallery. At that price point, services like Adobe Portfolio might be a better fit.

## Licenses

This project supports several **Creative Commons** options to define how your photos are used:

- **CC0 (Public Domain):** No rights reserved.
- **CC BY (Attribution):** Credit must be given to the creator.
- **CC BY-SA (ShareAlike):** Credit must be given; derivatives must use the same license.
- **CC BY-NC (Non-Commercial):** No business or profit-making use.
- **CC BY-ND (No-Derivatives):** No editing or transformations allowed.

You can set a global default in `settings.ts` or override it per album in `album.json`. You can also manually edit the generated `manifest.json`, but be aware that **re-syncing will overwrite these manual changes.** If you don't need licensing info, set it to **CC0** and hide the display in the settings.

### The Gallery source code itself is licensed under the [MIT License](LICENSE)
