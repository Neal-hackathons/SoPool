"use client";

import type { ColumnDef } from "@tanstack/react-table"
import type { Pool } from "./types"

export const columns: ColumnDef<Pool>[] = [
  {
    accessorKey: "pool",
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
