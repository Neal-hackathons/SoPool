import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppWalletProvider from "@/contexts/AppWalletProvider";
import AdminContextProvider from "@/contexts/AdminContextProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "SoPool",
	description: "An Alyra Project",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="min-h-screen h-full">
				<AppWalletProvider>
					<AdminContextProvider>{children}</AdminContextProvider>
				</AppWalletProvider>
			</body>
		</html>
	);
}
