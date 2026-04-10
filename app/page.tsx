import Gallery from "@/components/gallery";
import Social from "@/components/social";
import { settings } from "@/config";

export default function Page() {
	const { name, motto } = settings;

	return (
		<main className="">
			<div className="h-[40svh] flex flex-col justify-center items-center space-y-4">
				<Social />
				<div className="space-y-2">
					{motto ? (
						<p className="text-lg text-primary-muted text-center" data-speed="0.8">{motto}</p>
					) : null}
					<h1 className="text-4xl font-bold text-center" data-speed="0.75">{name}'s Gallery</h1>
				</div>
			</div>
			<Gallery />
		</main>
	);
}
