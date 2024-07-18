"use client";
import { useRouter } from "next/navigation";

export function Logo() {
	const router = useRouter();

	return (
		<div
			className="rounded-3xl bg-yellow-300 p-4 cursor-pointer"
			onKeyDown={() => router.push("/")}
		>
			SoPool
		</div>
	);
}
