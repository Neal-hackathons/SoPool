import { LOTTERY_PROGRAM_ID } from "@/lib/constants";
import { useConnection } from "@solana/wallet-adapter-react";

import { type AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import type { Lottery } from "./types/lottery";
import LotteryIDL from "./idl/lottery.json";
import { useAnchorProvider } from "./useAnchorProvider";
import { Keypair, PublicKey } from "@solana/web3.js";
import { useToast } from "@/components/ui/use-toast";
import { LOTTERY_SEED, MASTER_SEED } from "./static_seeds";
import { createMint } from "@solana/spl-token";
import { useEffect, useMemo, useState } from "react";

type CreateLotteryArgs = {
	lotteryName: string;
	owner: PublicKey;
};

type BuyTicketWithTokenArgs = {
	lottery_id: number;
};

type DepositToStakingArgs = {
	amount: number;
	lottery_id: number;
};

type RemoveFromStakingArgs = {
	lottery_id: number;
};

type BuyTicketArgs = {
	lottery_id: number;
};

type PickWinnerArgs = {
	lottery_id: number;
};

type ClaimPrizeArgs = {
	lottery_id: number;
	ticket_id: number;
};

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

export function useMintPublicKey(authorityPublicKey: PublicKey) {
	const [mintPublicKey, setMintPublicKey] = useState<PublicKey | null>(null);

	const { connection } = useConnection();

	// TODO: figure out how to get the signer
	const payer = Keypair.generate();

	useEffect(() => {
		(async () => {
			const key = await createMint(
				connection,
				payer,
				authorityPublicKey,
				null,
				8,
			);
			setMintPublicKey(key);
		})();
	});

	return mintPublicKey;
}




export function useLotteryProgram(authorityPublicKey: PublicKey) {
	// RPC connection related code
	const { connection } = useConnection();

	const { toast } = useToast();

	const provider = useAnchorProvider();

	const lotteryProgram = getLotteryProgram(provider);

	const getProgramAccount = () => {
		return connection.getParsedAccountInfo(LOTTERY_PROGRAM_ID);
	};

	// mintPubkey related code
	// TODO : figure out if we need this
	const mintPublicKey = useMintPublicKey(authorityPublicKey);

	const masterAccountPublicKey = PublicKey.createProgramAddressSync([Buffer.from(MASTER_SEED)],LOTTERY_PROGRAM_ID)

	// const [masterAccount, setMasterAccount] = useState<{lastId: number}>({lastId: 0});

	// useEffect(() => {
	// 	(async () => {
	// 		const masterAccount = await lotteryProgram.account.master.fetch(masterAccountPublicKey);
	// 		setMasterAccount(masterAccount);
	// 	})();
	// },[lotteryProgram.account.master.fetch, masterAccountPublicKey]);



	const initialize = () => {
		return lotteryProgram.methods.initMaster().rpc();
	};

	const depositToStaking = (amount: number, lotteryID: number) => {
		const lotteryPDAAddress = PublicKey.createProgramAddressSync(
			[Buffer.from(LOTTERY_SEED)],
			LOTTERY_PROGRAM_ID,
		);

		lotteryProgram.methods
			.depositToStaking(new BN(amount), lotteryID)
			.accounts({
				receipt: new PublicKey(""),
				tokenX: new PublicKey(""),
				synthXMint: new PublicKey(""),
				vaultX: new PublicKey(""),
				senderTokenSynthX: new PublicKey(""),
				senderTokenX: new PublicKey(""),
			})
			.rpc();

		// lotteryProgram.methods
		// 	.depositToStaking([])
		// 	.accounts({
		// 		lottery: lotteryPDAAddress,
		// 		receipt
		// 		authority: authorityPublicKey,
		// 	})
		// 	.rpc();
	};

	const createLottery = () => {
		const masterPDAAddress = PublicKey.createProgramAddressSync(
			[Buffer.from(MASTER_SEED)],
			LOTTERY_PROGRAM_ID,
		);

		const lotteryPDAAddress = PublicKey.createProgramAddressSync(
			[Buffer.from(LOTTERY_SEED)],
			LOTTERY_PROGRAM_ID,
		);

		lotteryProgram.methods
			.createLottery()
			.accounts({
				master: masterAccount,
				lottery: lotteryPDAAddress,
				authority: authorityPublicKey,
			})
			.rpc();
	};

	const buyTicketWithToken = () => {};

	const removeFromStaking = () => {};

	const buyTicket = () => {};

	const pickWinner = () => {};

	const claimPrizeToken = () => {};

	const refundTicketToken = () => {};
}
