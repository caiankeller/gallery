"use client";

import { useGSAP } from "@gsap/react";
import { IconArrowUp } from "@tabler/icons-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Button } from "./ui/button";

gsap.registerPlugin(ScrollTrigger);

export default function ReturnToTop() {
	const containerRef = useRef(null);

	useGSAP(() => {
		gsap.context(() => {
			const tl = gsap.to(containerRef.current, {
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 0.4,
				ease: "power3.out",
				paused: true,
			});

			ScrollTrigger.create({
				start: "top -400",
				onUpdate: (self) => {
					if (self.scroll() > 400) {
						tl.play();
					} else {
						tl.reverse();
					}
				},
			});
		});
	}, []);

	const handleScroll = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<div
			className="pointer-events-none fixed right-4 bottom-4 z-50 translate-y-10 scale-50 opacity-0"
			ref={containerRef}
		>
			<Button
				className="pointer-events-auto shadow-lg"
				onClick={handleScroll}
				variant="secondary"
			>
				Go back to the top <IconArrowUp />
			</Button>
		</div>
	);
}
