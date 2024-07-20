import type { ColumnDef } from "@tanstack/react-table";
import type { Lottery } from "./types";

export const adminColumns: ColumnDef<Lottery>[] = [
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

export const publicColumns: ColumnDef<Lottery>[] = [
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
  ];
  