import { AppHeader } from "@/components/AppHeader/appheader";

export default function Lottery({ params }: { params: { address: string } }) {
	return (
		<main className="min-h-screen bg-blue-600">
			<AppHeader />
			<section className="grid mx-auto space-y-4">
				<h1 className="text-7xl  place-self-center">TODO {params.address} </h1>
				<h1 className="text-7xl  place-self-center">
					TODO display 1 specific lottery{" "}
				</h1>
				<article className=" mx-auto grid grid-cols-2 gap-4">
					<div>Put text here</div>
					<div>Put text here</div>
					<div>Put text here</div>
					<div>Put text here</div>
					<div>Put text here</div>
					<div>Put text here</div>
				</article>
			</section>
		</main>
	);
}
