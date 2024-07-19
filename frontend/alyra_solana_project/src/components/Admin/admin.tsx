"use client";

import { AppHeader } from "@/components/AppHeader/appheader";
import { Button } from "@/components/ui/button";
import { useAdminContext } from "@/contexts/AdminContextProvider";
import {  useState, useEffect, useMemo } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { getLotteryProgram, confirmTx } from "../../lib/utils";
import type { Wallet, Program } from "@coral-xyz/anchor";
import type { Lottery } from "../../types/lottery";
import { Keypair , SystemProgram} from "@solana/web3.js";

function init_master(program : Program, wallet : Wallet) {
    
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

export function InitMaster () {
    const { connection } = useConnection();
	const wallet = useAnchorWallet();
    const program = useMemo(() => {
		if (connection && wallet) {
			return getLotteryProgram(connection, wallet as Wallet);
		}
	}, [connection, wallet]);


     return (
		<div className="container mx-auto py-10">
			<Button	className="max-w-xs mx-auto"
                    onClick={async () => { init_master(program,wallet)}}
            >
					Init Master
			</Button>
		</div>
	);
}