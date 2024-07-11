import { columns } from "./columns";
import { DataTable } from "./data-table";
import { SAMPLE_DATA } from "./sample-data";


import { createContext, useState, useEffect, useContext, useMemo } from "react";
import { SystemProgram } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { Thing } from "./types";

export function getData(): Array<Thing> {
// Fetch data from your the Pool contract.
	//const { pool } = viewPools();
  
	return [
     {
       pool: "SOOLO",
       description: "kjhjkhjk",
       yield: 5.2,
     }
   ]
 }

export function HomeTable() {
	//const pools = getData();

	return (
		<div className="container mx-auto py-10">
			<DataTable columns={columns} data={SAMPLE_DATA} />
		</div>
	);
}
