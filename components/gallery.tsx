"use client";

import React from "react";
import type { TView } from "@/app/page";
import ImageViewer from "@/components/image-viewer";
import type { IGalleryManifest } from "@/gallery/gallery.schema";
import ViewSwitcher from "./view-switcher";

type TProps = {
	manifest: IGalleryManifest;
};

export default function Gallery({ manifest }: TProps) {
	const [view, setView] = React.useState<TView>("all");

	const albumCount = manifest.albums.length;

	const albums =
		view === "all"
			? [
					{
						album: "Pinned",
						images: manifest.pinned,
					},
					{
						album: "All",
						images: manifest.all,
					},
				]
			: [
					{
						album: "Pinned",
						images: manifest.pinned,
					},
					...manifest.albums,
				];

	return (
		<div className="container mx-auto py-8">
			<ViewSwitcher
				albumsCount={albumCount}
				currentView={view}
				onViewChange={(view) => setView(view)}
			/>
			{albums.map(
				(album) =>
					Boolean(album.images.length) && (
						<div className="not-last:pb-16" key={album.album}>
							<div className="flex items-center justify-between py-4">
								<div>
									<h2 className="font-bold text-xl">{album.album}</h2>
									{album.description && (
										<p className="font-semibold text-muted-foreground">
											{album.description}
										</p>
									)}
								</div>
								<span className="font-semibold">
									— {album.images.length} images
								</span>
							</div>

							<div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
								{album.images.map((image, index) => (
									<div className="mb-4 break-inside-avoid" key={image.id}>
											<ImageViewer image={image} index={index + 1} />
										</div>
								))}
							</div>
						</div>
					),
			)}
		</div>
	);
}
