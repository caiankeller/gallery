'use client';

import { IconChevronDown } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { settings } from "@/config";
import type { IGalleryItem } from "@/gallery/gallery.schema";

interface IProps {
	photo: IGalleryItem;
	index: number;
}

export default function Photo({ photo, index }: IProps) {
	const { hideMetadata } = settings;

	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen((prev) => !prev);

	const hasCamera = Boolean(photo.camera);
	const hasDimensions = Boolean(photo.width && photo.height);
	const hasSettings = Boolean(photo.cameraSettings);
	const hasMetadata = hasCamera || hasDimensions || hasSettings;

	return (
		<div className="break-inside-avoid relative group">
			<Image
				// sorry blind people, got you guys real quick
				alt=""
				className="w-full h-auto block"
				height={photo.height}
				priority={index < 4}
				src={`/photos/${photo.filename}`}
				width={photo.width}
			/>

			{!hideMetadata && hasMetadata && (
				<div className="flex flex-col gap-2 p-2 bg-foreground/5">
					<div className="flex items-center justify-between gap-2">
						<div className="grid gap-1">
							{hasCamera && (
								<p className="text-xs uppercase font-mono text-muted-foreground font-medium leading-none">
									{photo.camera}
								</p>
							)}

							{hasDimensions && (
								<p className="text-sm uppercase font-mono text-muted-foreground font-medium leading-none">
									{photo.width} × {photo.height}
								</p>
							)}
						</div>

						{hasSettings && (
							<Button onClick={toggle} size="icon-xs" variant="secondary">
								<motion.div
									animate={{ rotate: isOpen ? 180 : 0 }}
									transition={{ type: "spring", stiffness: 300, damping: 20 }}
								>
									<IconChevronDown size={16} />
								</motion.div>
							</Button>
						)}
					</div>

					<AnimatePresence initial={false}>
						{isOpen && hasSettings && (
							<motion.div
								animate={{ height: "auto", opacity: 1 }}
								className="overflow-hidden"
								exit={{ height: 0, opacity: 0 }}
								initial={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.2 }}
							>
								<Separator className="mb-2" />

								<div className="space-y-1.5 pb-1">
									{Object.entries(photo.cameraSettings!).map(([key, value]) => (
										<p
											className="text-xs uppercase font-mono text-muted-foreground font-medium leading-none"
											key={key}
										>
											<span className="opacity-70">{key}:</span> {String(value)}
										</p>
									))}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			)}
		</div>
	);
}
