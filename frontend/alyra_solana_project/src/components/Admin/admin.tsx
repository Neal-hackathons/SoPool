"use client";

import { Button } from "@/components/ui/button";
import {  useMemo } from "react";
import { type AnchorWallet, useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { getLotteryProgram } from "../../lib/utils";
import type { Wallet, Program } from "@coral-xyz/anchor";
import type { Lottery } from "../../types/lottery";

function init_master(program: Program<Lottery>, wallet: AnchorWallet) {
	if (!program || !wallet) return;
	try {
		const txHash = program.methods
			.initMaster()
			.accounts({
				payer: wallet.publicKey,
			})
			//.signers([])
			.rpc();
		//console.log("after tx :", txHash);
		//confirmTx(txHash, connection);
	} catch (error) {
		console.log("SOMETHING WENT WRONG in init master");
		console.error(error);
	}
}

export function InitMaster() {
	const { connection } = useConnection();
	const wallet = useAnchorWallet();
	const program = useMemo(() => {
		if (connection && wallet) {
			return getLotteryProgram(connection, wallet as Wallet);
		}
	}, [connection, wallet]);

	if (!program || !wallet) {
		return (
			<div className="container mx-auto py-10">
				<Button className="max-w-xs mx-auto" disabled>
                    No program or wallet found
				</Button>
			</div>
		);
	}
    
	return (
		<div className="container mx-auto py-10">
			<Button
				className="max-w-xs mx-auto"
				onClick={async () => {
					init_master(program, wallet);
				}}
			>
				Init Master
			</Button>
		</div>
	);
}
