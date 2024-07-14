"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";

import {  useState, useEffect, useMemo } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import type { Pool } from "./types";
import { getProgram } from "../../lib/utils";
import type { Wallet } from "@project-serum/anchor";

export function PoolsTable() {
	const [pools, setPools] = useState<Pool[]>([]);

	const { connection } = useConnection();
	const wallet = useAnchorWallet();
	const program = useMemo(() => {
		if (connection && wallet) {
			return getProgram(connection, wallet as Wallet);
		}
	}, [connection, wallet]);

	useEffect(() => {
		if (!program) return;
		(async () => {
			try {
				const allPools = await program.account.pool.all();
				//console.log(allPools);
				const pools = allPools.map((pool) => {
					console.log(`Pool ${pool.account.prize}`);

					return {
						pool_addr: pool.publicKey.toBase58(),
						pool_code: pool.account.name.toString(),
						description: pool.account.description.toString(),
						yield: (Math.round(pool.account.poolYield*100))/100,
						prize: (Math.round(pool.account.prize*100))/100,
					};
				});
				setPools(pools);
			} catch (error) {
				console.log("SOMETHING WENT WRONG");
				console.error(error);
			}
		})();
	}, [program]);


	return (
		<div className="container mx-auto py-10">
			<DataTable columns={columns} data={pools} />
		</div>
	);
}
