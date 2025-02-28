"use server";
import { PublicKey } from "@solana/web3.js";
import { randomBytes } from "node:crypto";
import { sign } from "tweetnacl";
import bs58 from "bs58";

let csrfToken: string | undefined;

const ADMIN_PUBLIC_KEY =
	process.env.NEXT_PUBLIC_ADMIN_PUBLIC_KEY ??
	"7RTTHKW3xaU99LX8KVZtmVPqzEBiMWxCqGTxgMGjcHV4";

const ADMIN_PUBLIC_KEY_IN_BASE58 = new PublicKey(
	ADMIN_PUBLIC_KEY ?? "7RTTHKW3xaU99LX8KVZtmVPqzEBiMWxCqGTxgMGjcHV4",
).toBase58();

export async function csrfTokenFromServer(): Promise<string> {
	csrfToken = randomBytes(32).toString("hex");
	return csrfToken;
}

export async function verifyAdminSignature(
	adminSignedMessage: string,
): Promise<boolean> {
	if (adminSignedMessage === null) {
		return false;
	}

	if (csrfToken === undefined) {
		return false;
	}

	if (ADMIN_PUBLIC_KEY === undefined || !ADMIN_PUBLIC_KEY_IN_BASE58) {
		return false;
	}

	try {
		const encodedCSRFToken = new TextEncoder().encode(csrfToken);

		const uint8SignedMessage = bs58.decode(adminSignedMessage);

		const uint8AdminPublicKey = bs58.decode(ADMIN_PUBLIC_KEY_IN_BASE58);

		return sign.detached.verify(
			encodedCSRFToken,
			uint8SignedMessage, // adminSignedMessage
			uint8AdminPublicKey,
		);
	} catch (error) {
		return false;
	} finally {
		csrfToken = randomBytes(32).toString("hex");
	}
}
