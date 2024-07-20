"use client"

import { AppHeader } from "@/components/AppHeader/appheader";
import { PublicLotteriesTable } from "@/components/Lotteries/Lotteries";


export default function Lotteries() {
	return (
		<main className="min-h-screen bg-blue-600">
			<AppHeader />
			<PublicLotteriesTable />
			<section className="grid">
				<h1 className="text-1xl  place-self-center">This is the list stored on Solana</h1>
			</section>
		</main>
	);
}
