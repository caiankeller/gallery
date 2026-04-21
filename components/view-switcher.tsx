"use client";

import type { TView } from "@/app/page";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";

interface IProps {
	currentView: TView;
	albumsCount: number;
	onViewChange: (view: TView) => void;
}

const VIEW_OPTIONS: TView[] = ["albums", "all"];

export default function ViewSwitcher({
	albumsCount,
	currentView,
	onViewChange,
}: IProps) {
	return (
		<div className="flex items-center justify-end gap-2 py-4">
			<span className="font-semibold text-sm">View by</span>

			<ButtonGroup aria-label="View options" className="h-fit">
				{VIEW_OPTIONS.map((view) => (
					<Button
						className="capitalize disabled:opacity-60"
						disabled={
							currentView === view || (view === "albums" && albumsCount === 1)
						}
						key={view}
						onClick={() => onViewChange(view)}
						size="sm"
						variant="outline"
					>
						{view} {view === "albums" && `(${albumsCount})`}
					</Button>
				))}
			</ButtonGroup>
		</div>
	);
}
