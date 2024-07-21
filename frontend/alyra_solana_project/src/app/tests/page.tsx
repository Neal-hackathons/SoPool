"use client";

import { AppHeader } from "@/components/AppHeader/appheader";
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
			<section className="grid mx-auto">
                <h1 className="text-7xl  place-self-center">TODO</h1>
			</section>
		</main>
	);
}
