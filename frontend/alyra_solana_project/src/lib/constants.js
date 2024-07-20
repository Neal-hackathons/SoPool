import { PublicKey } from "@solana/web3.js";

export const STAKING_PROGRAM_ID = new PublicKey(
	process.env.NEXT_PUBLIC_STAKING_PROGRAM_ID ??
		"2X9yDvzea1rfp7NyRn9Fwi9ikhh2ho84pvDJ34GQSvWb",
);

export const LOTTERY_PROGRAM_ID = new PublicKey(
	process.env.NEXT_PUBLIC_LOTTERY_PROGRAM_ID ??
		"2JfVxGG5w5nxPwHKzMdhoewAhxz5Gj9wBKyZSuzQQ4Ye",
);

export const MASTER_SEED = "master";
export const LOTTERY_SEED = "lottery";

