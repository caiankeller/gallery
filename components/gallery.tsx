import React from "react";
import ImageViewer from "@/components/image-viewer";
import type { IGalleryManifest } from "@/gallery/gallery.schema";

type TProps = {
	view: "all" | "albums";
	manifest: IGalleryManifest;
};

export default async function Gallery({ view, manifest }: TProps) {
	const albums =
		view === "all"
			? [
					{
						album: "All",
						images: manifest.all,
					},
				]
			: [...manifest.albums].sort((a, b) => {
					if (a.album === "Pinned") return -1;
					if (b.album === "Pinned") return 1;
					return 0;
				});

	return (
		<React.Fragment>
			{albums.map((album) => (
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
						{album.images.map((image) => (
							<div className="mb-4 break-inside-avoid" key={image.id}>
								<ImageViewer image={image} />
							</div>
						))}
					</div>
				</div>
			))}
		</React.Fragment>
	);
}
