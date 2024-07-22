"use client";

import { AppHeader } from "@/components/AppHeader/appheader";
import { Button } from "@/components/ui/button";
import { useAdminContext } from "@/contexts/AdminContextProvider";
import { signedMessageFromWallet } from "@/lib/authentication_functions";
import { verifyAdminSignature } from "@/server_actions/login";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { useRouter } from "next/navigation";

export default function Login() {
	const { setIsAdmin } = useAdminContext();

	const wallet = useWallet();

	const router = useRouter();

	if (!wallet.connected) router.push("/");

	return (
		<main className="min-h-screen bg-blue-600">
			<AppHeader />
			<section className="grid space-y-8">
				<h1 className="text-7xl  place-self-center">login as admin</h1>
				<Button
					className="max-w-xs mx-auto bg-yellow-300 text-black"
					onClick={async () => {
						const signedMessage = await signedMessageFromWallet(wallet);

						if (!signedMessage) {
							router.push("/");
							return;
						}

						const damn = bs58.encode(signedMessage);

						const isAdmin = await verifyAdminSignature(damn);

						if (isAdmin) {
							setIsAdmin(true);
							router.push("/admin");
							return;
						}
					}}
				>
					Try to login
				</Button>
			</section>
		</main>
	);
}
