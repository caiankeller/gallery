import manifest from "@/gallery/manifest.json";
import Photo from "./photo";

export default function Gallery() {
	return (
		<div className="container mx-auto columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 py-16">
			{manifest.map((photo, index) => (
				<Photo
					index={index} // used for next priority loading logic
					key={photo.id}
					photo={photo}
				/>
			))}
		</div>
	);
}
