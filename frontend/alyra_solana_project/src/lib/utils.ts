import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AnchorProvider, BN, Program, type Wallet } from "@coral-xyz/anchor";
import type { Connection, Transaction } from "@solana/web3.js";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

import IDL_LOTTERY from "../idl/lottery.json";
//import IDL_STAKING from "./staking.json";

import {
	STAKING_PROGRAM_ID,
	LOTTERY_PROGRAM_ID,
	MASTER_SEED,
	LOTTERY_SEED,
	TICKET_SEED,
} from "./constants.js";
import type { Lottery } from "../types/lottery";

export const getLotteryProgram = (connection: Connection, wallet: Wallet) => {
	const provider = new AnchorProvider(connection, wallet, {
		commitment: "confirmed",
	});
	const program = new Program(IDL_LOTTERY as Lottery, provider);
	return program;
};

export const confirmTx = async (txHash: any, connection: Connection) => {
	const blockhashInfo = await connection.getLatestBlockhash();
	await connection.confirmTransaction({
		blockhash: blockhashInfo.blockhash,
		lastValidBlockHeight: blockhashInfo.lastValidBlockHeight,
		signature: txHash,
	});
};

/*export const getStakingProgram = (connection: Connection, wallet: Wallet) => {
	const provider = new AnchorProvider(connection, wallet, {
		commitment: "confirmed",
	});
	const program = new Program(IDL_STAKING as Idl, STAKING_PROGRAM_ID, provider);
	return program;
};*/

export const getMasterAddress = async () => {
	return (
		await PublicKey.findProgramAddress(
			[Buffer.from(MASTER_SEED)],
			LOTTERY_PROGRAM_ID,
		)
	)[0];
};

export const getNewLotteryAddress = async (index: number) => {
	const buffer = Buffer.alloc(4);
	buffer.writeUInt32LE(index + 1, 0);

	return (
		await PublicKey.findProgramAddress(
			[Buffer.from(LOTTERY_SEED), buffer],
			LOTTERY_PROGRAM_ID,
		)
	)[0];
};

export const getLotteryAddressAt = async (index: number) => {
	const buffer = Buffer.alloc(4);
	buffer.writeUInt32LE(index, 0);

	return (
		await PublicKey.findProgramAddress(
			[Buffer.from(LOTTERY_SEED), buffer],
			LOTTERY_PROGRAM_ID,
		)
	)[0];
};

export const getNewTicketAddress = async (
	index: number,
	lotteryAddress: PublicKey,
) => {
	const buffer = Buffer.alloc(4);
	buffer.writeUInt32LE(index + 1, 0);

	return (
		await PublicKey.findProgramAddress(
			[Buffer.from(TICKET_SEED), lotteryAddress.toBuffer(), buffer],
			LOTTERY_PROGRAM_ID,
		)
	)[0];
};

// Function to convert lamports to SOL
export function lamportsToSol(lamportsBN: BN) {
	// Define the conversion rate as a BN object
	const conversionRateBN = new BN("1000000000000000000", 10); // 2^64 lamports per SOL

	// Perform the division
	const solBN = lamportsBN.div(conversionRateBN);

	// Convert the result to a decimal string for readability
	const solDecimalString = solBN.toString(10);

	return solDecimalString;
}

// Function to convert lamports to SOL and format as "X SOL"
export function formatLamportsToSolForUI(lamports: BN) {
	const strLamports = lamports.toString(10,2);
	return strLamports.startsWith("0") ? `0.${strLamports.slice(1,2)} SOL` : `${strLamports.slice(0,1)} SOL`
}
