import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AnchorProvider, Program, type Wallet } from "@coral-xyz/anchor";
import type { Connection, Transaction } from "@solana/web3.js";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

import IDL_LOTTERY from "../idl/lottery.json";
//import IDL_STAKING from "./staking.json";

import { STAKING_PROGRAM_ID, LOTTERY_PROGRAM_ID } from "./constants.js";
import type { Lottery } from "../types/lottery";


export const getLotteryProgram = (connection: Connection, wallet: Wallet) => {
	const provider = new AnchorProvider(connection, wallet, {
		commitment: "confirmed",
	});
	const program = new Program(IDL_LOTTERY as Lottery, provider);
	return program;
};

export const confirmTx = async (txHash:any, connection: Connection) => {
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

/*export const getVoterAddress = async (votePublicKey, userPublicKey) => {
  return (
    await PublicKey.findProgramAddress(
      [votePublicKey.toBuffer(), userPublicKey.toBuffer()],
      PROGRAM_ID
    )
  )[0];
};*/
