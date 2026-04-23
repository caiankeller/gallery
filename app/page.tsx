import Gallery from "@/components/gallery";
import Social from "@/components/social";
import { settings } from "@/config";
import { GalleryManifestSchema } from "@/gallery/gallery.schema";
import manifest from "@/gallery/manifest.json";

export type TView = "albums" | "all";

const galleryManifest = GalleryManifestSchema.parse(manifest);

export default async function Page() {
	const { name, motto } = settings;

	return (
		<main>
			<div
				className="container flex flex-col justify-center space-y-4 py-12"
				
			>
				<div className="space-y-2">
					<h1 className="font-bold text-2xl">{name}&apos;s Gallery</h1>
					{motto && (
						<p className="max-w-3xl font-medium text-muted-foreground">
							{motto}
						</p>
					)}
				</div>
				<Social />
			</div>

			<Gallery manifest={galleryManifest} />
		</main>
	);
}
