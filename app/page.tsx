import Gallery from "@/components/gallery";
import Social from "@/components/social";
import ViewSwitcher from "@/components/view-switcher";
import { settings } from "@/config";
import { GalleryManifestSchema } from "@/gallery/gallery.schema";
import manifest from "@/gallery/manifest.json";

export type TView = "albums" | "all";

type TProps = {
	searchParams: Promise<{
		view?: string;
	}>;
};

const galleryManifest = GalleryManifestSchema.parse(manifest);

export default async function Page({ searchParams }: TProps) {
	const { name, motto } = settings;

	const { view } = await searchParams;

	const currentView: TView = view === "albums" ? "albums" : "all";
	const albumCount = galleryManifest.albums.length;

	return (
		<main>
			<div className="flex h-[40svh] flex-col items-center justify-center space-y-4">
				<Social />

				<div className="space-y-2">
					{motto && (
						<p
							className="max-w-3xl text-center font-medium text-lg text-muted-foreground"
							data-speed="0.8"
						>
							{motto}
						</p>
					)}

					<h1 className="text-center font-bold text-4xl" data-speed="0.75">
						{name}&apos;s Gallery
					</h1>
				</div>
			</div>

			<div className="container mx-auto py-16">
				<ViewSwitcher albumsCount={albumCount} currentView={currentView} />
				<Gallery manifest={galleryManifest} view={currentView} />
			</div>
		</main>
	);
}
