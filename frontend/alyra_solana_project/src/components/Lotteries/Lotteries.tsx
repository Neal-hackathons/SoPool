"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";

import {  useState, useEffect, useMemo } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import type { Lottery } from "../../types/lottery";
import { getLotteryProgram/*, getStakingProgram*/ } from "../../lib/utils";
import type { Wallet } from "@project-serum/anchor";

export function LotteriesTable() {
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
		(async () => {
			try {
				const allLotteries = await program.account.lottery.all();

				const lotteries = allLotteries.map((lottery) => {
					
					return {
						id: lottery.account.id,
						authority: lottery.publicKey.toBase58(),
						token: lottery.account.token.toString(),
						ticket_price: lottery.account.ticket_price,
						last_ticket_id: lottery.account.last_ticket_id,
						winner_id: lottery.account.winner_id,
						claimed: lottery.account.claimed,
					};
				});
				setLotteries(lotteries);
			} catch (error) {
				console.log("SOMETHING WENT WRONG");
				console.error(error);
			}
		})();
	}, [program]);


	return (
		<div className="container mx-auto py-10">
			<DataTable columns={columns} data={lotteries} />
		</div>
	);
}
