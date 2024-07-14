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
		if (connection) {
			return getProgram(connection, wallet as Wallet);
		}
	}, [connection, wallet]);

	useEffect(() => {
		if (!program) return;
		(async () => {
			try {
				const allPools = await program?.account.pool.all();
				console.log(allPools);
				const pools = allPools?.map((pool) => {
					console.log(`Pool ${pool}`);

					/**
					 * TODO:Write mapping code
					 * to map the data returned by program?.account.pool.all()
					 * to a Pool type : { pool: string; description: string; yield: number; }
					 */
					return {
						pool: pool.publicKey.toBase58(),
						description: /*pool.descritpion*/ "Desc",
						yield: /*pool.poolYield*/ 5.9,
					};
				});
				setPools(pools || []);
			} catch (error) {
				console.log("SOMETHING WENT WRONG");
				console.error(error);
			}
		})();
	}, [program]);

	//const pools_vect = { Pool : Array(pools.length)};
	//const pools_vect = new Pool[pools.length];
	//pools.forEach((pool,index) => {
	//	const poolElement:Pool = {
	//		pool: /*pool.name*/ "Sol" ,
	//		description: /*pool.descritpion*/ "Desc",
	//		yield: /*pool.poolYield*/ 5.9,
	//	}
	//	pools_vect.fill(poolElement);
	//});

	return (
		<div className="container mx-auto py-10">
			<DataTable columns={columns} data={pools} />
		</div>
	);
}
