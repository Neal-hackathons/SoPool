"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";

import { useState, useEffect } from "react";
import type { Lottery } from "./types";

import { useAnchorProvider } from "@/hooks/useAnchorProvider";
import { getLotteryProgram } from "@/hooks/useLotteryProgram";

export function LotteriesTable() {
	const [lotteries, setLotteries] = useState<Lottery[]>([]);

	const provider = useAnchorProvider();

	const lotteryProgram = getLotteryProgram(provider);

	useEffect(() => {
		(async () => {
			try {
				const allLotteries = await lotteryProgram.account.lottery.all();

				const lotteries = allLotteries.map((lottery) => {
					return {
						id: lottery.account.id,
						authority: lottery.account.authority,
						token: lottery.account.token,
						ticketPrice: lottery.account.ticketPrice,
						lastTicketId: lottery.account.lastTicketId,
						winnerId: lottery.account.winnerId,
						claimed: lottery.account.claimed,
					};
				});

				setLotteries(lotteries);
			} catch (error) {
				console.log("SOMETHING WENT WRONG");
				console.error(error);
			}
		})();
	}, [lotteryProgram]);

	return (
		<div className="container mx-auto py-10">
			<DataTable columns={columns} data={lotteries} />
		</div>
	);
}
