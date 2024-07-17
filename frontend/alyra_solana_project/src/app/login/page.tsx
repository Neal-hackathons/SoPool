"use client";

import { AppHeader } from "@/components/AppHeader/appheader";
import { Button } from "@/components/ui/button";
import { useAdminContext } from "@/contexts/AdminContextProvider";
import { signedMessageFromWallet } from "@/lib/authentication_functions";
import { verifyAdminSignature } from "@/server_actions/login";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { redirect } from "next/navigation";

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
			<section className="grid">
				<h1 className="text-7xl  place-self-center">Login as Admin</h1>
				<Button
					onClick={async () => {
						const signedMessage = await signedMessageFromWallet(wallet);

						if (!signedMessage) return redirect("/");
						console.log("signedMessage", signedMessage[0]);


						const damn = new TextDecoder().decode(signedMessage);

						const isAdmin = await verifyAdminSignature(damn);

						setIsAdmin(isAdmin);

						if (isAdmin) redirect("/dashboard");
					}}
				>
					Try to login
				</Button>
			</section>
		</main>
	);
}
