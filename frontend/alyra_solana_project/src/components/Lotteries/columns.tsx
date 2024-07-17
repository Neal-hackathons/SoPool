import type { ColumnDef } from "@tanstack/react-table";
import type { Lottery } from "./types";

export const columns: ColumnDef<Lottery>[] = [
  {
    accessorKey: "description",
    header: "Description",
  },
	{
		accessorKey: "lottery_code",
		header: "Lottery_code",
	},
	{
		accessorKey: "lottery_addr",
		header: "Address",
	},
	{
		accessorKey: "prize",
		header: "Prize",
	},
	{
		accessorKey: "yield",
		header: "Yield",
	},
];
