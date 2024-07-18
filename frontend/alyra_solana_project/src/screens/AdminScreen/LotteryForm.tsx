"use client";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./../../components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useLotteryProgram } from "@/hooks/useLotteryProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import type { PublicKey } from "@solana/web3.js";

const LOTTERY_FORM_SCHEMA = z.object({
	ticket_price: z.number(),
});

export function LotteryForm() {
	const { toast } = useToast();

	const wallet = useWallet();

	const lotteryProgram = useLotteryProgram(wallet.publicKey as PublicKey);

	const theLotteryForm = useForm<z.infer<typeof LOTTERY_FORM_SCHEMA>>({
		resolver: zodResolver(LOTTERY_FORM_SCHEMA),
	});

	async function onSubmit(values: z.infer<typeof LOTTERY_FORM_SCHEMA>) {
		try {
			// TODO: implement smart contract code
			// After Success
			toast({
				title: "Done!",
				description: "lottery registered!",
			});
		} catch (error) {
			// TODO: error logic if needed
			// After error
			toast({
				title: "Error.",
				description: "An error occured.",
			});
		}
	}
	return (
		<section className="flex flex-col gap-14">
			<h3 className="text-3xl font-bold">Lottery:</h3>
			<Form {...theLotteryForm}>
				<form onSubmit={theLotteryForm.handleSubmit(onSubmit)}>
					<FormField
						control={theLotteryForm.control}
						name="ticket_price"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{field.name}</FormLabel>
								<FormControl>
									<Input
										placeholder={field.name}
										defaultValue={0}
										{...field}
										className="text-2xl text-gray-950"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button className="mt-2" type="submit">
						Add a lottery
					</Button>
				</form>
			</Form>
		</section>
	);
}
