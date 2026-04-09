import {
	IconArrowUpRight,
	IconBrandGithub,
	IconBrandInstagram,
	IconBrandPinterest,
	IconBrandUnsplash,
	IconMail,
} from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { settings } from "@/config";

export default function Social() {
	const { email, CTA } = settings;

	const SOCIAL_LINKS = [
		{
			label: "Pinterest",
			icon: <IconBrandPinterest />,
			url: settings.social.pinterest,
		},
		{
			label: "Instagram",
			icon: <IconBrandInstagram />,
			url: settings.social.instagram,
		},
		{
			label: "Unsplash",
			icon: <IconBrandUnsplash />,
			url: settings.social.unsplash,
		},
		{
			label: "GitHub",
			icon: <IconBrandGithub />,
			url: settings.social.github,
		},
	].filter((link): link is typeof link & { url: string } => !!link.url);

	const hasContent = Boolean(email) || SOCIAL_LINKS.length > 0 || Boolean(CTA);

	if (!hasContent) {
		return (
			<p className="text-sm text-muted-foreground">
				No contact options available.
			</p>
		);
	}

	return (
		<div className="flex gap-1.5 flex-wrap justify-center" data-speed="0.9">
			{email && (
				<Button asChild className="group" size="sm" variant="link">
					<Link href={`mailto:${email}`}>
						<IconMail />
						E-mail me
						<IconArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
					</Link>
				</Button>
			)}

			{SOCIAL_LINKS.map(({ label, icon, url }) => (
				<Button asChild className="group" key={label} size="sm" variant="link">
					<Link href={url} rel="noopener noreferrer" target="_blank">
						{icon}
						{label}
						<IconArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
					</Link>
				</Button>
			))}

			{CTA && (
				<Button asChild className="group" size="sm">
					<Link href={CTA.url} rel="noopener noreferrer" target="_blank">
						{CTA.label}
					</Link>
				</Button>
			)}
		</div>
	);
}
