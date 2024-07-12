import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { AnchorProvider, Program, type Wallet, type Idl} from "@project-serum/anchor";
//import { WalletAdapter } from "@solana/wallet-adapter-wallets";
import type { Connection } from "@solana/web3.js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



import IDL from "./idl.json";
import {
  PROGRAM_ID,
} from "./constants.js";

export const getProgram = (connection:Connection, wallet:Wallet ) => {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  const program = new Program(IDL as Idl, PROGRAM_ID, provider);
  return program;
};

/*export const getVoterAddress = async (votePublicKey, userPublicKey) => {
  return (
    await PublicKey.findProgramAddress(
      [votePublicKey.toBuffer(), userPublicKey.toBuffer()],
      PROGRAM_ID
    )
  )[0];
};*/