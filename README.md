# Gallery

A lightweight, self-hosted photo gallery built with Next.js and React. Designed for simplicity and independence, it functions with zero external services.

[Deployed demostration](https://photos.caiankeller.com)

## Why this exists

I built this as a 4-hour birthday project because I wanted a way to own my pictures without relying on third-party platforms or social media. I don’t even have an Instagram, and I believe everyone should have a hassle-free way to host their own memories/work. This repo is designed to be accessible even to those with minimal technical knowledge, allowing you to get a gallery up and running in minutes.

## How to Use It

### Configuration

The [settings](/config/settings.ts) file allows you to customize the UI to match your information. Review the variables in that file to get started. You can adventure yourself into changing the code as you'd like, but this provides a great start to anyone that just want their name and a website online, that is truly yours.

### Adding Images

The gallery structure begins in `gallery/images/`. Every directory (including the root) should contain an `album.json` file like the following:

```json
{
  "title": "Board",
  "description": "Optional description",
  "license": "CC0"
}
```

This defines the album's metadata and the license applied to its contents. You can drop your images into the root (which I use as a general album, aggrouping anything that doesn't have a defined category) or organize them into folders, which is how albums work:

#### Creating Albums

To create an album, simply create a folder inside `gallery/images/` and include an `album.json`. While folder names are flexible, using **slugified** names (e.g., `my-summer-trip`) is recommended.

#### Pinning Images

To "pin" an image so it appears in the special **Pinned** UI section, prefix the filename with an asterisk (e.g., `*photo.jpg`). The sync process will recognize this flag while keeping the image in its original album.

-----

## Sync & Deployment

### 1\. Sync the Manifest

Once your images are organized, run the sync command:

```bash
npm run sync
```

This generates a public manifest and processes your images into **WebP** format—reducing storage and bandwidth usage by roughly **60%**. This process is non-destructive and will not alter your original files.

### 2\. Run the application

Install the dependencies and start the development server:

```bash
npm install
npm run dev
```

## Deploying

There's several ways of putting this online, which I will cover the most easy ones, in great detail, ASAP.

-----

## Licenses

This project supports several **Creative Commons** options to define how your photos are used:

* **CC0 (Public Domain):** No rights reserved.
* **CC BY (Attribution):** Credit must be given to the creator.
* **CC BY-SA (ShareAlike):** Credit must be given; derivatives must use the same license.
* **CC BY-NC (Non-Commercial):** No business or profit-making use.
* **CC BY-ND (No-Derivatives):** No editing or transformations allowed.

You can set a global default in `settings.ts` or override it per album in `album.json`. You can also manually edit the generated `manifest.json`, but be aware that **re-syncing will overwrite these manual changes.** If you don't need licensing info, set it to **CC0** and hide the display in the settings.
