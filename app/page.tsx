import Gallery from "@/components/gallery";
import Social from "@/components/social";
import { settings } from "@/config";

export default function Page() {
	const { name, motto } = settings;

	return (
		<main className="">
			<div className="h-[40svh] flex flex-col justify-center items-center space-y-4">
				<Social />
				<div className="space-y-2" data-speed="0.8">
					<h1 className="text-4xl font-bold text-center">{name}'s Gallery</h1>
					{motto ? (
						<p className="text-lg text-muted-foreground text-center">{motto}</p>
					) : null}
				</div>
			</div>
			<Gallery />
		</main>
	);
}
