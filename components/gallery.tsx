import { useMemo } from "react";
import Photo from "@/components/photo";
import { GalleryManifestSchema } from "@/gallery/gallery.schema";
import manifest from "@/gallery/manifest.json";

export default function Gallery() {
	const photos = useMemo(() => {
		return GalleryManifestSchema.parse(manifest);
	}, []);

	return (
		<div className="container mx-auto colmuns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 py-16">
			{photos.map((photo) => (
				<div className="break-inside-avoid mb-4" key={photo.id}>
					<Photo photo={photo} />
				</div>
			))}
		</div>
	);
}
