"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";

import {  useState, useEffect, useMemo } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import type { Lottery } from "./types";
import { getProgram } from "../../lib/utils";
import type { Wallet } from "@project-serum/anchor";

export function LotteriesTable() {
	const [lotteries, setLotteries] = useState<Lottery[]>([]);

	const { connection } = useConnection();
	const wallet = useAnchorWallet();
	const program = useMemo(() => {
		if (connection && wallet) {
			return getProgram(connection, wallet as Wallet);
		}
	}, [connection, wallet]);

	useEffect(() => {
		if (!program) return;
		(async () => {
			try {
				const allLotteries = await program.account.pool.all();

				const lotteries = allLotteries.map((lottery) => {
					console.log(`lottery ${lottery.account.prize}`);

					return {
						lottery_addr: lottery.publicKey.toBase58(),
						lottery_code: lottery.account.name.toString(),
						description: lottery.account.description.toString(),
						yield: (Math.round(lottery.account.poolYield*100))/100,
						prize: (Math.round(lottery.account.prize*100))/100,
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
