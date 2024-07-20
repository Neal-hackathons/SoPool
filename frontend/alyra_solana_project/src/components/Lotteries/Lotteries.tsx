"use client";

import { adminColumns, publicColumns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";


import {  useState, useEffect, useMemo } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { getLotteryProgram, getLotteryAddressAt,/*, getStakingProgram*/ 
getNewTicketAddress} from "../../lib/utils";
import type { Wallet } from "@coral-xyz/anchor";
import type { Lottery } from "./types";
import { Connection } from "@solana/web3.js";

const loadLotteries = async (program:any) => {
	try {
		const allLotteries = await program.account.lottery.all();

		return allLotteries.map((lottery) => ({
			
				id: lottery.account.id,
				authority: lottery.publicKey.toBase58(),
				token: lottery.account.token.toString(),
				ticket_price: lottery.account.ticketPrice,
				last_ticket_id: lottery.account.lastTicketId,
				winner_id: lottery.account.winnerId,
				claimed: lottery.account.claimed,
			}));
	} catch (error) {
		console.log("SOMETHING WENT WRONG in load lotteries");
		console.error(error);
		return [];
	}

}

export const pickWinner = async (lotteryId: number, program: Lottery, wallet: Wallet) => {

	if (lotteryId <= 0) return;
	if (!program || !wallet) return;
	try {
		const lotteryAddress = await getLotteryAddressAt(lotteryId);
		
		const txHash = await program.methods
			.pickWinner(lotteryId)
			.accounts({
				lottery: lotteryAddress,
				payer: wallet.publicKey,
			})
			//.signers([wallet.publicKey])
			.rpc();
		//confirmTx(txHash, connection);
	} catch (error) {
		console.log("SOMETHING WENT WRONG in pickwinner");
		console.error(error);
	}
}
export const buyTicket = async (lotteryId: number, program: Lottery, wallet: Wallet) => {

	if (lotteryId <= 0) return;
	if (!program || !wallet) return;
	try {
		const lotteryAddress = await getLotteryAddressAt(lotteryId);

		const lotteryData = await program.account.lottery.fetch(lotteryAddress);
        if (!lotteryData) {
            throw new Error('Compte non trouvé');
        }
		//console.log("last Ticke", lotteryData.lastTicketId);
		const ticketAddress = await getNewTicketAddress(lotteryData.lastTicketId, lotteryAddress);
		
		const txHash = await program.methods
			.buyTicket(lotteryId)
			.accounts({
				lottery: lotteryAddress,
				ticket: ticketAddress,
				buyer: wallet.publicKey,
			})
			//.signers([wallet.publicKey])
			.rpc();
		//confirmTx(txHash, connection);
	}
	 catch (error) {
		console.log("SOMETHING WENT WRONG in buyTicket");
		console.error(error);
	}
}

export const claimPrize = async (lotteryId: number, program: Lottery, wallet: Wallet) => {

	/*if (lotteryId <= 0) return;
	if (!program || !wallet) return;
	try {
		const lotteryAddress = await getLotteryAddressAt(lotteryId);

		const lotteryData = await program.account.lottery.fetch(lotteryAddress);
        if (!lotteryData) {
            throw new Error('Compte non trouvé');
        }
		const ticketAddress = await getNewTicketAddress(lotteryData.lastTicketId);
		
		const txHash = await program.methods
			.buyTicket(lotteryId)
			.accounts({
				lottery: lotteryAddress,
				ticket: ticketAddress
				buyer: wallet.publicKey,
			})
			//.signers([wallet.publicKey])
			.rpc();
		//confirmTx(txHash, connection);
	} catch (error) {
		console.log("SOMETHING WENT WRONG in pickwinner");
		console.error(error);
	}*/
}

export function PublicLotteriesTable() {
	const [lotteries, setLotteries] = useState<Lottery[]>([]);
	const { connection } = useConnection();
  	const wallet = useAnchorWallet();

	const program = useMemo(() => {
	if (connection && wallet) {
		return getLotteryProgram(connection, wallet as Wallet);
	}
	}, [connection, wallet]);

	
	useEffect(() => {
		if (!program) return;
	
		const fetchLotteries = async () => {
			const loadedLotteries = await loadLotteries(program);
			setLotteries(loadedLotteries);
		};
		fetchLotteries();
	}, [program]);

	if (!lotteries.length) return <div>Loading...</div>;

	return (
		<div className="container mx-auto py-10">
			<DataTable columns={publicColumns} data={lotteries} />
		</div>
	);
}

export function AdminLotteriesTable() {
	const [lotteries, setLotteries] = useState<Lottery[]>([]);
	const { connection } = useConnection();
  	const wallet = useAnchorWallet();

	const program = useMemo(() => {
	if (connection && wallet) {
		return getLotteryProgram(connection, wallet as Wallet);
	}
	}, [connection, wallet]);

	
	useEffect(() => {
		if (!program) return;
	
		const fetchLotteries = async () => {
			const loadedLotteries = await loadLotteries(program);
			setLotteries(loadedLotteries);
		};

		fetchLotteries();
	}, [program]);

	if (!lotteries.length) return <div>Loading...</div>;

	return (
		<div className="container mx-auto py-10">
			<DataTable columns={adminColumns} data={lotteries}/>
		</div>
	);
}