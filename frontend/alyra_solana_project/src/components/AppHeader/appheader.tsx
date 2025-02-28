"use client"
import { ConnectWallet } from "./connectWallet";
import { Logo } from "./logo";
import { Navigation } from "./navigation";

export function AppHeader() {
	return (
		<header className="mx-auto flex items-center justify-between p-4" >
			<Logo />
			<Navigation />
			<ConnectWallet />
		</header>
	);
}
