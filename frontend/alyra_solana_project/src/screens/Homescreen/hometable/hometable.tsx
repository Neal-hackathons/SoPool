"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { SAMPLE_DATA } from "./sample-data";




export function HomeTable() {
	

	return (
		<div className="container mx-auto py-10">
			<DataTable columns={columns} data={SAMPLE_DATA} />
		</div>
	);
}
