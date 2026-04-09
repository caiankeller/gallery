"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollSmoother, ScrollTrigger } from "gsap/all";
import type { ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

interface Props {
	children: ReactNode;
}

export default function ScrollSmootherWrapper({ children }: Props) {
	useGSAP(() => {
		ScrollSmoother.create({
			smooth: 2,
			effects: true,
			smoothTouch: 0.1,
		});
	});

	return (
		<div id="smooth-wrapper">
			<div id="smooth-content">{children}</div>
		</div>
	);
}
