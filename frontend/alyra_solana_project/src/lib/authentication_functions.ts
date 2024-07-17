import { serverLogin, verifyAdminSignature } from "@/server_actions/login";
import type { WalletContextState } from "@solana/wallet-adapter-react";

export const signedMessageFromWallet = async (
	wallet: WalletContextState,
): Promise<Uint8Array | null> => {
	try {
		const backendMessage = await serverLogin();

		const encodedBackendMessage = new TextEncoder().encode(backendMessage);

		if (!wallet.signMessage) {
			console.error("The wallet does not support message signing");
			return null;
		}

		const signedMessage = await wallet.signMessage(encodedBackendMessage);

		return signedMessage;
	} catch (error) {
		console.error(error);
		return null;
	}
};
