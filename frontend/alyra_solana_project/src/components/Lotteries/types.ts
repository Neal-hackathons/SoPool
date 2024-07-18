export type Lottery = {
	id: number;
	authority: string;
	token: string;
	ticket_price: number;
	last_ticket_id: number;
	winner_id: number;
	claimed: boolean;
};
