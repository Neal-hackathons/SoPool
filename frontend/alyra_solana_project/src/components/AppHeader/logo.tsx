import { redirect } from "next/navigation";

export function Logo() {
    return (
        <div className="rounded-3xl bg-yellow-300 p-4" onKeyDown={() => redirect("/")}>
            SoPool
        </div>
    )
}