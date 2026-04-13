"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { settings } from "@/config";
import type { IGalleryItem } from "@/gallery/gallery.schema";
import { IconX } from "@tabler/icons-react";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface IProps {
	image: IGalleryItem;
}

export default function ImageViewer({ image }: IProps) {
	const { hideMetadata } = settings;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [mounted, setMounted] = useState(false);

	const wrapRef = useRef<HTMLButtonElement>(null);
	const overlayRef = useRef<HTMLDivElement>(null);
	const modalImgRef = useRef<HTMLImageElement>(null);
	const closeBtnRef = useRef<HTMLButtonElement>(null);
	const startBoundsRef = useRef<{
		x: number;
		y: number;
		w: number;
		h: number;
	} | null>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		document.body.style.overflow = isModalOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isModalOpen]);

	useEffect(() => {
		if (!isModalOpen) return;

		const overlay = overlayRef.current;
		const modalImg = modalImgRef.current;
		const closeBtn = closeBtnRef.current;
		const wrap = wrapRef.current;
		if (!overlay || !modalImg || !closeBtn || !wrap) return;

		const imageRect = wrap.getBoundingClientRect();
		const sx = imageRect.left;
		const sy = imageRect.top;
		const sw = imageRect.width;
		const sh = imageRect.height;

		startBoundsRef.current = { x: sx, y: sy, w: sw, h: sh };

		const aspect = (image.width || 0) / (image.height || 0);
		const maxW = window.innerWidth * 0.9;
		const maxH = window.innerHeight * 0.9;
		let tw: number, th: number;
		if (maxW / aspect <= maxH) {
			tw = maxW;
			th = maxW / aspect;
		} else {
			th = maxH;
			tw = maxH * aspect;
		}
		const tx = (window.innerWidth - tw) / 2;
		const ty = (window.innerHeight - th) / 2;

		gsap.set(modalImg, { x: sx, y: sy, width: sw, height: sh });
		gsap.set(closeBtn, { opacity: 0, scale: 0.5 });

		gsap.to(overlay, { opacity: 1, duration: 0.3, ease: "power2.out" });
		gsap.to(modalImg, {
			x: tx,
			y: ty,
			width: tw,
			height: th,
			duration: 0.5,
			ease: "power3.out",
		});
		gsap.to(closeBtn, {
			opacity: 1,
			scale: 1,
			duration: 0.25,
			delay: 0.25,
			ease: "back.out(2)",
		});
	}, [isModalOpen, image.width, image.height]);

	function handleClose() {
		const overlay = overlayRef.current;
		const modalImg = modalImgRef.current;
		const closeBtn = closeBtnRef.current;
		const bounds = startBoundsRef.current;
		if (!overlay || !modalImg || !closeBtn || !bounds) return;

		gsap.to(closeBtn, {
			opacity: 0,
			scale: 0.5,
			duration: 0.18,
			ease: "power2.in",
		});
		gsap.to(overlay, { opacity: 0, duration: 0.35, delay: 0.05 });
		gsap.to(modalImg, {
			x: bounds.x,
			y: bounds.y,
			width: bounds.w,
			height: bounds.h,
			duration: 0.45,
			ease: "power3.inOut",
			onComplete: () => setIsModalOpen(false),
		});
	}

	return (
		<div className="group relative break-inside-avoid">
			<button
				className="group/image relative w-full cursor-zoom-in overflow-hidden bg-muted"
				onClick={() => setIsModalOpen(true)}
				ref={wrapRef}
				type="button"
			>
				<Image
					// not the best, but a little better
					alt={image.caption ?? ""}
					className="block h-auto w-full"
					height={image.height}
					priority={true}
					src={`/images/${image.filename}`}
					width={image.width}
				/>
				{image.caption && (
					<div className="absolute bottom-0 w-full overflow-clip bg-background/50 p-3 backdrop-blur-xl before:backdrop-blur-xl">
						<p className="relative text-left font-semibold text-xs">
							{image.caption}
						</p>
					</div>
				)}
				{settings.showLicense && (
					<div className="absolute top-2 right-2">
						<p className="font-mono font-semibold text-[10px] opacity-50 transition-opacity duration-300 ease-out group-hover/image:opacity-100">
							{image.license} license
						</p>
					</div>
				)}
			</button>

			{mounted &&
				createPortal(
					isModalOpen && (
						// biome-ignore lint/a11y/useSemanticElements: okay biome, you can rest now
						<div
							className="fixed inset-0 z-50 cursor-zoom-out"
							onClick={handleClose}
							onKeyDown={(e) => {
								if (e.key === "Escape") {
									e.preventDefault();
									handleClose();
								}
							}}
							ref={overlayRef}
							role="button"
							style={{ opacity: 0 }}
							tabIndex={0}
						>
							<div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

							{/** biome-ignore lint/performance/noImgElement: not very recommend using Image/next here */}
							<img
								alt=""
								className="pointer-events-auto fixed top-0 left-0 object-contain shadow-2xl"
								ref={modalImgRef}
								src={`/images/${image.filename}`}
								style={{ margin: 0 }}
							/>

							<Button
								className="fixed top-4 right-4 z-50"
								onClick={(e) => {
									e.stopPropagation();
									handleClose();
								}}
								ref={closeBtnRef}
								size="icon-xs"
							>
								<IconX size={32} />
							</Button>
						</div>
					),
					document.body,
				)}

			{!hideMetadata && hasMetadata(image) && (
				<div className="flex flex-col bg-foreground/3 p-2.5">
					<div className="flex items-center justify-between gap-2">
						<div className="grid gap-1">
							{image.camera && (
								<p className="font-bold font-mono text-[10px] text-primary uppercase leading-none">
									{new Date(image.date).toLocaleDateString("en-US", {
										month: "short",
										year: "2-digit",
										day: "2-digit",
									})}
								</p>
							)}
							<p className="font-medium font-mono text-muted-foreground text-xs uppercase leading-none">
								{image.width} × {image.height}
							</p>
						</div>
					</div>

					<Separator className="my-1.5 opacity-50" />
					<div className="space-y-1">
						{image.cameraSettings ? (
							Object.entries(image.cameraSettings).map(([key, value]) => (
								<p
									className="font-medium font-mono text-muted-foreground text-xs uppercase leading-none"
									key={key}
								>
									<span className="opacity-50">{key}:</span> {String(value)}
								</p>
							))
						) : (
							<p className="font-medium font-mono text-muted-foreground text-xs uppercase leading-none opacity-50">
								No Metadata to show.
							</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

function hasMetadata(image: IGalleryItem) {
	return Boolean(
		image.camera || (image.width && image.height) || image.cameraSettings,
	);
}
