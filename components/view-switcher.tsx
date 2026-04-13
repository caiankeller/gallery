"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { TView } from "@/app/page";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";

interface IProps {
	currentView: TView;
	albumsCount: number;
}

const VIEW_OPTIONS: TView[] = ["albums", "all"];

export default function ViewSwitcher({ currentView, albumsCount }: IProps) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();

	const handleClick = (view: TView) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("view", view);
		router.replace(`${pathname}?${params.toString()}`);
	};

	return (
		<div className="flex items-center justify-end gap-2 py-4">
			<span className="font-semibold text-sm">View by</span>

			<ButtonGroup aria-label="View options" className="h-fit">
				{VIEW_OPTIONS.map((view) => {
					const isDisabled =
						currentView === view || (view === "albums" && albumsCount === 1);

					return (
						<Button
							className="capitalize disabled:opacity-60"
							disabled={isDisabled}
							key={view}
							onClick={() => handleClick(view)}
							variant="outline"
						>
							{view} {view === "albums" && `(${albumsCount})`}
						</Button>
					);
				})}
			</ButtonGroup>
		</div>
	);
}
