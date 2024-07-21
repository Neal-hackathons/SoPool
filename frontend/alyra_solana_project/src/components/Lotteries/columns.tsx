import type { ColumnDef } from "@tanstack/react-table";
import type { UILottery } from "./types";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import type { Wallet } from "@coral-xyz/anchor";

import { getLotteryProgram } from "../../lib/utils";

import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { pickWinner, buyTicket, claimPrize } from "./Lotteries";
import { ArrowUpDown } from "lucide-react";

export const adminColumns: ColumnDef<UILottery>[] = [
	{
		accessorKey: "id",
		header: "Identifier",
	},
	{
		accessorKey: "token",
		header: "Token",
	},
	{
		accessorKey: "ticket_price",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Ticket price
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "last_ticket_id",
		header: "Ticket Count",
	},
	{
		accessorKey: "winner_id",
		header: "Winner",
	},
	{
		accessorKey: "claimed",
		header: "Claimed",
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const lottery = row.original;
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const { connection } = useConnection();
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const wallet = useAnchorWallet();
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const program = useMemo(() => {
				if (connection && wallet) {
					return getLotteryProgram(connection, wallet as Wallet);
				}
			}, [connection, wallet]);

			if (!program || !wallet) return null;

			const handlePickWinner = async (lotteryId: number) => {
				if (!wallet) {
					console.log("Wallet not connected");
					return;
				}

				await pickWinner(lotteryId, program, wallet);
			};

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Close Lottery</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handlePickWinner(lottery.id)}>
							Pick Winner
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

export const publicColumns: ColumnDef<UILottery>[] = [
	{
		accessorKey: "id",
		header: "Identifier",
	},
	{
		accessorKey: "token",
		header: "Token",
	},
	{
		accessorKey: "ticket_price",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Ticket price
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "last_ticket_id",
		header: "Ticket Count",
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const lottery = row.original;
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const { connection } = useConnection();
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const wallet = useAnchorWallet();
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const program = useMemo(() => {
				if (connection && wallet) {
					return getLotteryProgram(connection, wallet as Wallet);
				}
			}, [connection, wallet]);

			if (!program || !wallet) return null;

			const handleBuyTicket = async (lotteryId: number) => {
				if (!wallet) {
					console.log("Wallet not connected");
					return;
				}

				await buyTicket(lotteryId, program, wallet);
			};
			const handleClaimPrize = async (lotteryId: number) => {
				if (!wallet) {
					console.log("Wallet not connected");
					return;
				}

				await claimPrize(lotteryId, program, wallet);
			};

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => handleBuyTicket(lottery.id)}>
							Buy Ticket
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleClaimPrize(lottery.id)}>
							Claim Prize
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
