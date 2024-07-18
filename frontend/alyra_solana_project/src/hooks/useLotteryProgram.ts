import { LOTTERY_PROGRAM_ID } from "@/lib/constants";
import { useConnection } from "@solana/wallet-adapter-react";

import { type AnchorProvider, Program } from "@coral-xyz/anchor";
import type { Lottery } from "./types/lottery";
import LotteryIDL from "./idl/lottery.json";
import { useAnchorProvider } from "./useAnchorProvider";
import { PublicKey } from "@solana/web3.js";
import { useToast } from "@/components/ui/use-toast";


type CreateLotteryArgs = {
	lotteryName: string;
	owner: PublicKey
};

type BuyTicketWithTokenArgs = {
	lottery_id: number;
};

type DepositToStakingArgs = {
	amount: number,
	lottery_id: number;
};

type RemoveFromStakingArgs = {
	lottery_id: number;
};

type BuyTicketArgs = {
	lottery_id: number;
}

type PickWinnerArgs = {
	lottery_id: number;
};

type ClaimPrizeArgs = {
	lottery_id: number;
	ticket_id: number;
}

type ClaimPrizeTokenArgs = {
	lottery_id: number;
	ticket_id: number;
};

type RefundTicketTokenArgs = {
	lottery_id: number;
	ticket_id: number;
};

export function getLotteryProgram(provider: AnchorProvider) {
	return new Program(LotteryIDL as Lottery, provider);
}

export function useLotteryProgram(account: PublicKey ) {
	const { connection } = useConnection();

	const { toast } = useToast();

	const provider = useAnchorProvider();

	const lotteryProgram = getLotteryProgram(provider);

	const getProgramAccount = () => {
		return connection.getParsedAccountInfo(LOTTERY_PROGRAM_ID);
	};

	const initialize = async () => {
		lotteryProgram.methods.initMaster().rpc();
	};

	const createLottery = async (lotteryArgs: CreateLotteryArgs) => {
		const createdLotteryPDAAddress = PublicKey.createProgramAddressSync(
			[Buffer.from(lotteryArgs.lotteryName), account.toBuffer()],
			LOTTERY_PROGRAM_ID
		)

		lotteryProgram.methods
			.createLottery([])
			.accounts({
				lottery: createdLotteryPDAAddress
			})
			.rpc();
	};

	const buyTicketWithToken = () => {};

	const depositToStaking = async () => {
		const lotteryPDAAddress = PublicKey.createProgramAddressSync(
			[Buffer.from("lottery"), account.toBuffer()],
			LOTTERY_PROGRAM_ID
		)
	};

	const removeFromStaking = () => {};

	const buyTicket = () => {};

	const pickWinner = () => {};

	const claimPrizeToken = () => {};

	const refundTicketToken = () => {};
}
