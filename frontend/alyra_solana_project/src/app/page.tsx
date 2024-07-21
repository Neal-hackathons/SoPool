import { AppHeader } from "@/components/AppHeader/appheader";
import { PublicLotteriesTable } from "@/components/Lotteries/Lotteries";

export default function Home() {
	return (
		<main className="min-h-screen h-full bg-blue-600">
			<AppHeader />
			<section className="grid min-h-80 place-items-center">
				<PublicLotteriesTable/>
			</section>
		</main>
	);
}
