"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Connection } from "@solana/web3.js";
import { BN } from "bn.js";
import { useMemo } from "react";
import {
	type AnchorWallet,
	useAnchorWallet,
	useConnection,
} from "@solana/wallet-adapter-react";
import { useState } from "react";
import {
	getNewLotteryAddress,
	getLotteryProgram,
	getMasterAddress,
} from "../../lib/utils";

import type { Wallet, Program } from "@coral-xyz/anchor";
import type { Lottery } from "../../types/lottery";

const init_master = async (
	program: Program<Lottery>, 
	wallet: AnchorWallet
) => {
	if (!program || !wallet) return;
	try {
		const masterAddress = await getMasterAddress();
		console.log("master", masterAddress.toString());
		const txHash = program.methods
			.initMaster()
			.accounts({
				// @ts-expect-error
				master: masterAddress,
				payer: wallet.publicKey,
			})
			.rpc();
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
		<div className="container mx-auto py-10 space-y-3 flex flex-col items-center justify-between">
			<h2>Initialze Protocol</h2>
			<Button
				className="max-w-xs mx-auto bg-yellow-300 text-black"
				onClick={async () => {
					init_master(program, wallet);
				}}
			>
				Init Master
			</Button>
		</div>
	);
}

const create_loss_lottery = async (
	program: Program<Lottery>,
	wallet: AnchorWallet,
	connection: Connection,
	price: number,
) => {
	if (price <= 0) return;
	const priceLamport = new BN(price * 1000000000);

	if (!program || !wallet) return;
	try {
		const masterAddress = await getMasterAddress();
		console.log("master ", masterAddress.toString());

		const accountData = await program.account.master.fetch(masterAddress);
		if (!accountData) {
			throw new Error("Compte non trouvé");
		}

		//console.log("masterInfo ", accountData.lastId);

		const lotteryAddress = await getNewLotteryAddress(accountData.lastId);
		//console.log("lottery ", lotteryAddress.toString());
		//console.log("lamport ", priceLamport);

		const txHash = await program.methods
			.createLottery(priceLamport)
			.accounts({
				lottery: lotteryAddress,
				// @ts-expect-error
				master: masterAddress,
				payer: wallet.publicKey,
			})
			//.signers([wallet.publicKey])
			.rpc();
		//console.log("after tx :", txHash);
		//confirmTx(txHash, connection);
	} catch (error) {
		console.log("SOMETHING WENT WRONG in create lottery");
		console.error(error);
	}
};
export function CreateLossLottery() {
	const [price, setPrice] = useState("");

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
		<div className="container mx-auto py-10 space-y-6">
			<Input
				type="number"
				id="price"
				value={price}
				placeholder="Ticket Price (SOL)"
				onChange={(e) => setPrice(e.target.value)}
			/>
			<Button
				className="max-w-xs mx-auto bg-yellow-300 text-black"
				onClick={async () => {
					create_loss_lottery(
						program,
						wallet,
						connection,
						Number.parseFloat(price),
					);
				}}
			>
				Create Lottery
			</Button>
			<p> (funds are transferred to the winner)</p>
		</div>
	);
}
