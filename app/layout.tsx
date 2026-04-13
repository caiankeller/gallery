import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import ScrollSmootherWrapper from "@/components/scroll-smoother";
import { ThemeProvider } from "@/components/theme-provider";
import { settings } from "@/config";
import { cn } from "@/lib/utils";
import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: settings.name,
	description: settings.motto,
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

type TProps = Readonly<{
	children: React.ReactNode;
}>;

export default function RootLayout({ children }: TProps) {
	return (
		<html
			className={cn("antialiased", "font-sans", bricolageGrotesque.variable)}
			lang="en"
			suppressHydrationWarning
		>
			<body className="scroll-smooth bg-neutral-50 font-thin tracking-tight antialiased selection:bg-primary selection:text-primary-foreground before:pointer-events-none before:fixed before:z-1 before:h-screen before:w-screen before:bg-[url(/noise.png)] before:opacity-60 before:mix-blend-difference before:invert after:pointer-events-none after:fixed after:inset-0 after:z-1 dark:bg-neutral-950 dark:before:opacity-30">
				<div className="pointer-events-none fixed inset-0 z-0 bg-[url(/topography.png)] bg-center bg-cover opacity-3 dark:opacity-1 dark:invert" />
				<ThemeProvider>
					<ScrollSmootherWrapper>{children}</ScrollSmootherWrapper>
				</ThemeProvider>
			</body>
		</html>
	);
}
