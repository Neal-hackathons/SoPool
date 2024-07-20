import type { BN } from "@coral-xyz/anchor";
import type { PublicKey } from "@solana/web3.js";

export type Lottery = {
    id: number;
    authority: PublicKey;
    token: PublicKey;
    ticketPrice: BN;
    lastTicketId: number;
    winnerId: number;
    claimed: boolean;
}


