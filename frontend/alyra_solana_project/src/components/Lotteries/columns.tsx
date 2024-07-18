import type { ColumnDef } from "@tanstack/react-table";
import type { Lottery } from "../../types/lottery";

export const columns: ColumnDef<Lottery>[] = [
  {
    accessorKey: "id",
    header: "Identifier",
  },
	{
		accessorKey: "token",
		header: "Token",
	},
	{
		accessorKey: "ticket_price",
		header: "Ticket Price",
	},
	{
		accessorKey: "last_ticket_id",
		header: "Ticket Count",
	},
	{
		accessorKey: "winner_id",
		header: "Winner",
	},
	{
		accessorKey: "claimed",
		header: "Claimed",
	},
];
