import { AppHeader } from "@/components/AppHeader/appheader";
import { HomeTable } from "@/screens/Homescreen/hometable/hometable";

export default function Home() {
	return (
		<main className="min-h-screen h-full bg-blue-600">
			<AppHeader />
			<section className="grid">
				<HomeTable />
			</section>
		</main>
	);
}
