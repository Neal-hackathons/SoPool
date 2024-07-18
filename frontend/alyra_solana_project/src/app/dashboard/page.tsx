import { AppHeader } from "@/components/AppHeader/appheader";

export default function Dashboard() {
	return (
		<main className="min-h-screen h-full bg-blue-600">
			<AppHeader />
			<section className="grid">
				<h1 className="text-7xl  place-self-center">TODO DASHBOARD</h1>
			</section>
		</main>
	);
}
