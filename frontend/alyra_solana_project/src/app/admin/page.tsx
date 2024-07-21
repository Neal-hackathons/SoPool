"use client";

import { AppHeader } from "@/components/AppHeader/appheader";
import { InitMaster, CreateLossLottery } from "@/components/Admin/admin";
import { Button } from "@/components/ui/button";
import { AdminLotteriesTable } from "@/components/Lotteries/Lotteries";


export default function Admin() {
	return (
		<main className="min-h-screen h-full bg-blue-600">
			<AppHeader />
			<section className="grid mx-auto">
				<InitMaster/>
			</section>
			<section className="grid mx-auto">
				<CreateLossLottery/>
			</section>
			<section className="grid mx-auto">
				<AdminLotteriesTable/>
			</section>
		</main>
	);
}
