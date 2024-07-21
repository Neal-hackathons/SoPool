import type BN from "bn.js";

export type UILottery = {
	id: number;
	authority: string;
	token: string;
	ticket_price: BN;
	last_ticket_id: number;
	winner_id: number;
	claimed: boolean;
};
