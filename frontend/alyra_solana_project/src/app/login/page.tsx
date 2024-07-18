"use client";

import { AppHeader } from "@/components/AppHeader/appheader";
import { Button } from "@/components/ui/button";
import { useAdminContext } from "@/contexts/AdminContextProvider";
import { signedMessageFromWallet } from "@/lib/authentication_functions";
import { verifyAdminSignature } from "@/server_actions/login";
import { useWallet } from "@solana/wallet-adapter-react";
import { redirect } from "next/navigation";
import bs58 from "bs58";

export default function Login() {
	const { isAdmin, setIsAdmin } = useAdminContext();
	const wallet = useWallet();

	if (!wallet.connected) redirect("/");

	if (isAdmin) {
		redirect("/dashboard");
	}

	return (
		<main className="min-h-screen bg-blue-600">
			<AppHeader />
			<section className="grid space-y-8">
				<h1 className="text-7xl  place-self-center">Login as Admin</h1>
				<Button className="max-w-xs mx-auto"
					onClick={async () => {
						const signedMessage = await signedMessageFromWallet(wallet);

						if (!signedMessage) {
							setIsAdmin(false);
							return;
						}

						console.log("signedMessage", signedMessage.slice(0, 4));

						console.log("keyBytes", wallet.publicKey?.toBytes());

						const damn = bs58.encode(signedMessage);

						const isAdmin = await verifyAdminSignature(damn);
						
						setIsAdmin(isAdmin);
					}}
				>
					Try to login
				</Button>
			</section>
		</main>
	);
}
