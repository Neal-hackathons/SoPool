"use client";

import { adminColumns, publicColumns } from "./columns";
import { DataTable } from "./data-table";

import {  useState, useEffect, useMemo } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { getLotteryProgram/*, getStakingProgram*/ } from "../../lib/utils";
import type { Wallet } from "@coral-xyz/anchor";
import type { Lottery } from "./types";

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
			<DataTable columns={adminColumns} data={lotteries} />
		</div>
	);
}