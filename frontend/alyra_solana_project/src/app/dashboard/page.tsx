import { AppHeader } from "@/components/AppHeader/appheader";

export default function Dashboard() {
	const lotteriesList = ["Lottery 1", "Lottery 2", "Lottery 3"];
	return (
		<main className="min-h-screen h-full bg-blue-600">
			<AppHeader />
			<section className="grid mx-auto">
				<section className="grid grid-cols-3 mx-auto gap-2">
					<article className="col-span-1">
						<h2 className="text-7xl  place-self-center">Lottery form</h2>
					</article>
					<article className="col-span-1 flex gap-3 flex-col items-center">
						<h2 className="text-7xl  place-self-center">Close a lottery</h2>
						<ul>
							{lotteriesList.map((lottery) => {
								return <li key={lottery}>{lottery}</li>;
							})}
						</ul>
					</article>
					<article className="col-span-1">
						<h2 className="text-7xl  place-self-center">Draw winner</h2>
					</article>
				</section>
			</section>
		</main>
	);
}
