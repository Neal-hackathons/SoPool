"use client";

import { adminColumns, publicColumns } from "./columns";
import { DataTable } from "./data-table";

import { useState, useEffect, useMemo } from "react";
import {
	type AnchorWallet,
	useAnchorWallet,
	useConnection,
} from "@solana/wallet-adapter-react";
import {
	getLotteryProgram,
	getLotteryAddressAt /*, getStakingProgram*/,
	getNewTicketAddress,
	getTicketAddressAt,
	formatLamportsToSolForUI,
} from "../../lib/utils";
import type { Program, Wallet } from "@coral-xyz/anchor";
import type { UILottery } from "./types";
import type { Lottery } from "@/types/lottery";
import { Button } from "../ui/button";

const loadLotteries = async (program: Program<Lottery>) => {
	try {
		const allLotteries = await program.account.lottery.all();

		return allLotteries.map((lottery) => {
			return {
				id: lottery.account.id,
				authority: lottery.publicKey.toBase58(),
				token: lottery.account.token.toBase58(),
				ticket_price: formatLamportsToSolForUI(lottery.account.ticketPrice),
				last_ticket_id: lottery.account.lastTicketId,
				winner_id: lottery.account.winnerId,
				claimed: lottery.account.claimed,
			};
		});
	} catch (error) {
		console.log("SOMETHING WENT WRONG in load lotteries");
		console.error(error);
		return [];
	}
};

export const pickWinner = async (
	lotteryId: number,
	program: Program<Lottery>,
	wallet: AnchorWallet,
) => {
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
};
export const buyTicket = async (
	lotteryId: number,
	program: Program<Lottery>,
	wallet: AnchorWallet,
) => {
	if (lotteryId <= 0) return;
	if (!program || !wallet) return;
	try {
		const lotteryAddress = await getLotteryAddressAt(lotteryId);

		const lotteryData = await program.account.lottery.fetch(lotteryAddress);
		if (!lotteryData) {
			throw new Error("Compte non trouvé");
		}
		//console.log("last Ticke", lotteryData.lastTicketId);
		const ticketAddress = await getNewTicketAddress(
			lotteryData.lastTicketId,
			lotteryAddress,
		);

		const txHash = await program.methods
			.buyTicket(lotteryId)
			.accounts({
				// @ts-expect-error
				lottery: lotteryAddress,
				ticket: ticketAddress,
				buyer: wallet.publicKey,
			})
			//.signers([wallet.publicKey])
			.rpc();
		//confirmTx(txHash, connection);
	} catch (error) {
		console.log("SOMETHING WENT WRONG in buyTicket");
		console.error(error);
	}
};

export const claimPrize = async (
	lotteryId: number,
	program: Program<Lottery>,
	wallet: AnchorWallet,
) => {
	if (lotteryId <= 0) return;
	if (!program || !wallet) return;
	try {
		const lotteryAddress = await getLotteryAddressAt(lotteryId);
	
		const lotteryData = await program.account.lottery.fetch(lotteryAddress);
		if (!lotteryData) {
			throw new Error('Compte non trouvé');
		}
		const winnerId = lotteryData.winnerId;
		const ticketAddress = await getTicketAddressAt(winnerId, lotteryAddress);
		const txHash = await program.methods
			.claimPrize(lotteryId, winnerId)
			.accounts({
			lottery: lotteryAddress,
			ticket: ticketAddress,
			buyer: wallet.publicKey,
			})
			//.signers([wallet.publicKey])
			.rpc();
			//confirmTx(txHash, connection);
		} catch (error) {
			console.log("SOMETHING WENT WRONG in claimPrize");
			console.error(error);
		}
};		

export function PublicLotteriesTable() {
	const [lotteries, setLotteries] = useState<UILottery[]>([]);
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

	if (lotteries.length === 0)
		return (
			<h1 className="flex items-center justify-between text-3xl">
				Loading... is Wallet connected ?...
			</h1>
		);

	return (
		<div className="container mx-auto py-10">
			<DataTable columns={publicColumns} data={lotteries} />
		</div>
	);
}

export function AdminLotteriesTable() {
	const [lotteries, setLotteries] = useState<UILottery[]>([]);
	const [viewMode, setViewMode] = useState<"claimed" | "unclaimed" | "all">(
		"all",
	);
	const claimedLotteries = lotteries.filter((lottery) => lottery.claimed);
	const unclaimedLotteries = lotteries.filter((lottery) => !lottery.claimed);
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
		<div className="container mx-auto py-10 space-y-8">
			<div className="flex items-center justify-between">
				<Button
					className="bg-yellow-300 text-black"
					onClick={() => setViewMode("all")}
				>
					All
				</Button>
				<Button
					className="bg-yellow-300 text-black"
					onClick={() => setViewMode("unclaimed")}
				>
					Unclaimed
				</Button>
				<Button
					className="bg-yellow-300 text-black"
					onClick={() => setViewMode("claimed")}
				>
					Claimed
				</Button>
			</div>
			{viewMode === "all" && (
				<DataTable columns={adminColumns} data={lotteries} />
			)}

			{viewMode === "claimed" && (
				<DataTable columns={adminColumns} data={claimedLotteries} />
			)}

			{viewMode === "unclaimed" && (
				<DataTable columns={adminColumns} data={unclaimedLotteries} />
			)}
		</div>
	);
}
