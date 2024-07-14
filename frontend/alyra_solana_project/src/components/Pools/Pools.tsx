"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";

import { createContext, useState, useEffect, useContext, useMemo } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Pool } from "./types";
import { getProgram } from "../../lib/utils";
import {Wallet} from "@project-serum/anchor";


export function PoolsTable() {
	
	const { connection } = useConnection();
	const wallet = useAnchorWallet();
	const program = useMemo(() => {
    if (connection) { return getProgram(connection, wallet as Wallet); }
  	}, [connection, wallet]);
	const pools = program.account.pool.all();

	let pools_vect:Pool[] =[];
	const poolElement:Pool = {
		pool: /*pool.name*/ "Sol" ,
		description: /*pool.descritpion*/ "Desc",
		yield: /*pool.poolYield*/ 5.9,
	}
	pools_vect.fill(poolElement);

	//const pools_vect = { Pool : Array(pools.length)};
	//const pools_vect = new Pool[pools.length];
	//pools.forEach((pool,index) => {
		//console.log('Pool ${pool}');
	//	const poolElement:Pool = {
	//		pool: /*pool.name*/ "Sol" ,
	//		description: /*pool.descritpion*/ "Desc",
	//		yield: /*pool.poolYield*/ 5.9,
	//	}
	//	pools_vect.fill(poolElement);
	//});

	return (
		<div className="container mx-auto py-10">
			<DataTable columns={columns} data={pools_vect} />
		</div>
	);
}
