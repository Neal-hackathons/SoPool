import { csrfTokenFromServer } from "@/server_actions/login";
import type { WalletContextState } from "@solana/wallet-adapter-react";

export const signedMessageFromWallet = async (
	wallet: WalletContextState,
): Promise<Uint8Array | null> => {
	try {
		const backendTextCSRFToken = await csrfTokenFromServer();

		const uint8EncodedBackendMessage = new TextEncoder().encode(backendTextCSRFToken);

		if (!wallet.signMessage) {
			console.error("The wallet does not support message signing");
			return null;
		}

		const signedUint8Message = await wallet.signMessage(uint8EncodedBackendMessage);

		return signedUint8Message;
	} catch (error) {
		console.error(error);
		return null;
	}
};
