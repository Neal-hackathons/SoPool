"use client"

import { AppHeader } from "@/components/AppHeader/appheader";
import { PublicLotteriesTable } from "@/components/Lotteries/Lotteries";


export default function Lotteries() {
	return (
		<main className="min-h-screen bg-blue-600">
			<AppHeader />
			<PublicLotteriesTable />
		</main>
	);
}
