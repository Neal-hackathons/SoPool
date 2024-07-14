import type { ColumnDef } from "@tanstack/react-table"
import type { Pool } from "./types"

export const columns: ColumnDef<Pool>[] = [
  {
    accessorKey: "pool_code",
    header: "Pool",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "yield",
    header: "Yield",
  },
]
