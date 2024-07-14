"use client"

import { AppHeader } from "@/components/AppHeader/appheader";
import { PoolsTable } from "@/components/Pools/Pools";

export default function Pools() {
	return (
		<main className="min-h-screen bg-blue-600">
			<AppHeader />
			<PoolsTable />
			<section className="grid">
				<h1 className="text-1xl  place-self-center">This is the list stored on Solana</h1>
			</section>
		</main>
	);
}
