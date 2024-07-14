"use client"

import { AppHeader } from "@/components/AppHeader/appheader";
import { PoolsTable } from "@/components/Pools/Pools";

export default function Pools() {
	return (
		<main className="min-h-screen bg-blue-600">
			<AppHeader />
			<PoolsTable />
			<section className="grid">
				<h1 className="text-7xl  place-self-center">TODO</h1>
			</section>
		</main>
	);
}
