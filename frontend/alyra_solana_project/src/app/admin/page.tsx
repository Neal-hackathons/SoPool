"use client";

import { AppHeader } from "@/components/AppHeader/appheader";
import { InitMaster, CreateLossLottery } from "@/components/Admin/admin";
import { AdminLotteriesTable } from "@/components/Lotteries/Lotteries";
import { useAdminContext } from "@/contexts/AdminContextProvider";

export default function Admin() {
	const { isAdmin } = useAdminContext();

	if (!isAdmin)
		return (
			<main className="min-h-screen h-full bg-blue-600">
				<AppHeader />
				<h1 className="text-7xl  place-self-center text-center">Not admin</h1>
			</main>
		);

	return (
		<main className="min-h-screen h-full bg-blue-600">
			<AppHeader />
			<section className="mx-auto flex flex-col items-center">
				<article className="grid mx-auto col-span-2">
					<InitMaster />
				</article>
				<article className="mx-auto cols-span-2 flex items-center justify-between w-1/2">
					<CreateLossLottery />
				</article>
				<article className="grid mx-auto cols-span-2">
					<AdminLotteriesTable />
				</article>
			</section>
		</main>
	);
}
