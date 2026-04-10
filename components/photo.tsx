"use client";

import { IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { settings } from "@/config";
import type { IGalleryItem } from "@/gallery/gallery.schema";

interface IProps {
	photo: IGalleryItem;
}

export default function Photo({ photo }: IProps) {
	const { hideMetadata } = settings;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		document.body.style.overflow = isModalOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isModalOpen]);

	const photoId = `photo-anim-${photo.filename}`;

	return (
		<div className="break-inside-avoid relative group mb-6">
			<motion.div
				className="cursor-zoom-in overflow-hidden bg-muted relative group/image"
				layoutId={photoId}
				onClick={() => setIsModalOpen(true)}
			>
				<Image
					// not the best, but a little better
					alt={photo.caption ?? ""}
					className="w-full h-auto block hover:opacity-90 transition-opacity"
					height={photo.height}
					priority={true}
					src={`/photos/${photo.filename}`}
					width={photo.width}
				/>
				{photo.caption && (
					<motion.div className="p-2 absolute backdrop-blur-xl bottom-0 w-full overflow-clip group-hover/image:opacity-100 transition-opacity duration-300 opacity-0 bg-background/80">
						<p className="text-xs font-semibold">{photo.caption}</p>
					</motion.div>
				)}
			</motion.div>

			{mounted &&
				createPortal(
					<AnimatePresence mode="wait">
						{isModalOpen && (
							<div className="fixed inset-0 z-9 flex items-center justify-center p-4">
								<motion.div
									animate={{ opacity: 1 }}
									className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-zoom-out"
									exit={{ opacity: 0 }}
									initial={{ opacity: 0 }}
									onClick={() => setIsModalOpen(false)}
								/>

								<motion.div
									className="relative z-10 max-w-full max-h-full flex items-center justify-center pointer-events-none"
									layoutId={photoId}
									transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
								>
									{/** biome-ignore lint/performance/noImgElement: Image/next is not very recommended here */}
									<img
										alt=""
										className="max-w-full max-h-[90vh] object-contain shadow-2xl pointer-events-auto"
										src={`/photos/${photo.filename}`}
									/>

									<Button
										className="absolute -top-8 right-0"
										onClick={(e) => {
											e.stopPropagation();
											setIsModalOpen(false);
										}}
										size="icon-xs"
									>
										<IconX size={32} />
									</Button>
								</motion.div>
							</div>
						)}
					</AnimatePresence>,
					document.body,
				)}

			{!hideMetadata && hasMetadata(photo) && (
				<div className="flex flex-col p-2.5 bg-foreground/3">
					<div className="flex items-center justify-between gap-2">
						<div className="grid gap-1">
							{photo.camera && (
								<p className="text-[10px] uppercase font-mono text-primary font-bold leading-none">
									{new Date(photo.date).toLocaleDateString("en-US", {
										month: "short",
										year: "2-digit",
										day: "2-digit",
									})}
								</p>
							)}
							<p className="text-xs uppercase font-mono text-muted-foreground font-medium leading-none">
								{photo.width} × {photo.height}
							</p>
						</div>
					</div>

					<Separator className="my-1.5 opacity-50" />
					<div className="space-y-1">
						{photo.cameraSettings ? (
							Object.entries(photo.cameraSettings).map(([key, value]) => (
								<p
									className="text-xs uppercase font-mono text-muted-foreground font-medium leading-none"
									key={key}
								>
									<span className="opacity-50">{key}:</span> {String(value)}
								</p>
							))
						) : (
							<p className="text-xs uppercase font-mono text-muted-foreground opacity-50 font-medium leading-none">
								No Metadata to show.
							</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

function hasMetadata(photo: IGalleryItem) {
	return Boolean(
		photo.camera || (photo.width && photo.height) || photo.cameraSettings,
	);
}
