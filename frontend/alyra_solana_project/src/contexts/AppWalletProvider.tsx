"use client";

import { useMemo } from "react";
import {
	ConnectionProvider,
	WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";


export default function AppWalletProvider({
	children,
}: {
	children: React.ReactNode;
}) {

    // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
	const network = WalletAdapterNetwork.Devnet;

	// You can also provide a custom RPC endpoint
	const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    
    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
	// Only the wallets you configure here will be compiled into your application
	const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets} autoConnect>
				<WalletModalProvider>{children}</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
}
