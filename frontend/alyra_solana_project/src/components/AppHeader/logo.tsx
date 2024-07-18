import Link from "next/link";

export function Logo() {
	return (
		<Link className="rounded-3xl bg-yellow-300 p-4 cursor-pointer" href={"/"}>
			SoPool
		</Link>
	);
}
