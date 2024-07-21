import { PublicKey } from "@solana/web3.js";

export const STAKING_PROGRAM_ID = new PublicKey(
	process.env.NEXT_PUBLIC_STAKING_PROGRAM_ID ??
		"3K44q3YYWGyeXsW3sh5zM1QkfDNiPjuSKPJko5v28WPo",
);

export const LOTTERY_PROGRAM_ID = new PublicKey(
	process.env.NEXT_PUBLIC_LOTTERY_PROGRAM_ID ??
		"13r5dniDEeMszUj4kMyQHcpQEKQmvDWYwjevdkB4Ta9",
);

export const MASTER_SEED = "master";
export const LOTTERY_SEED = "lottery";
export const TICKET_SEED = "ticket";

