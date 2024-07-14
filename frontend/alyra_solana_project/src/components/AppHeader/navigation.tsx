"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const components: { title: string; href: string; description: string }[] = [
	{
		title: "Home",
		href: "/",
		description: "Home page",
	},
	{
		title: "Home",
		href: "/",
		description: "Home page",
	},
	{
		title: "Pools",
		href: "/pools",
		description: "Pools",
	},
	{
		title: "Help",
		href: "/help",
		description: "Help",
	},
	{
		title: "Leaderboard",
		href: "/leaderboard",
		description: "leaderboard",
	},
];

export function Navigation() {
	const wallet = useWallet();

	const isConnected = wallet.connected;

	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Pages</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
							{components
								.map((component) => {
                  if (component.title === "Pools" && !isConnected) return null;
									return (
										<ListItem
											key={component.title}
											title={component.title}
											href={component.href}
										>
											{component.description}
										</ListItem>
									);
								})
								.filter(Boolean)}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem className="flex items-center justify-between gap-4">
					<Link href="/help" legacyBehavior passHref>
						<NavigationMenuLink className={navigationMenuTriggerStyle()}>
							help
						</NavigationMenuLink>
					</Link>
					{isConnected && (
						<Link href="/pools" legacyBehavior passHref>
							<NavigationMenuLink className={navigationMenuTriggerStyle()}>
								pools
							</NavigationMenuLink>
						</Link>
					)}
					<Link href="/leaderboard" legacyBehavior passHref>
						<NavigationMenuLink className={navigationMenuTriggerStyle()}>
							leaderboard
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

const ListItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className,
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none">{title}</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";
