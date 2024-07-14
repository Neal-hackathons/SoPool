"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function ConnectWallet() {
	return (
		<WalletMultiButton
			style={{
				color: "black",
				backgroundColor: "#fde047",
				borderRadius: "30px",
			}}
		/>
	);
}
