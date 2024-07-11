"use client";

//import style from "../../app/styles/Header.module.css";


import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider, WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

function Wallet({ children }: { children: React.ReactNode }) {
    // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
    const network = WalletAdapterNetwork.Devnet;
  
    // You can also provide a custom RPC endpoint
    const endpoint = useMemo(() => clusterApiUrl(network), []);
  
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

export function ConnectWallet() {
    return (
        <Wallet>
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <div></div>
        <div className="flex space-x-4">
          <WalletMultiButton/>
        </div>
        <div></div>
      </div>
    </Wallet>
    );
}
