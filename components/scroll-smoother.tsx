"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollSmoother, ScrollTrigger } from "gsap/all";
import type { ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

interface IProps {
	children: ReactNode;
}

export default function ScrollSmootherWrapper({ children }: IProps) {
	useGSAP(() => {
		ScrollSmoother.create({
			smooth: 3,
			effects: true,
			smoothTouch: 0.5,
		});
	});

	return (
		<div id="smooth-wrapper">
			<div id="smooth-content">{children}</div>
		</div>
	);
}
