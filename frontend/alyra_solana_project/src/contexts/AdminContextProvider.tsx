"use client";

import {
	createContext,
	type Dispatch,
	type SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";

type AdminContext = {
	isAdmin: boolean;
	setIsAdmin: Dispatch<SetStateAction<boolean>>;
};
const adminContext = createContext<AdminContext | null>(null);

export function useAdminContext() {
	const context = useContext(adminContext);
	if (context === null) {
		throw new Error(
			"useAdminContext must be used within an AdminContextProvider",
		);
	}

	return context;
}

export default function AdminContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isAdmin, setIsAdmin] = useState(false);

	const contextValue = {
		isAdmin,
		setIsAdmin,
	};


	return (
		<adminContext.Provider value={contextValue}>
			{children}
		</adminContext.Provider>
	);
}
