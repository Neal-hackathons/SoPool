
export type UILottery = {
	id: number;
	authority: string;
	token: string;
	ticket_price: string;
	last_ticket_id: number;
	winner_id: number;
	claimed: boolean;
};
