"use server";
import { PublicKey } from "@solana/web3.js";
import { randomBytes } from "node:crypto";
import { sign } from "tweetnacl";
import bs58 from "bs58"

let csrfToken: string | undefined;

const ADMIN_PUBLIC_KEY = process.env.NEXT_PUBLCIC_ADMIN_PUBLIC_KEY as string;

const ADMIN_PUBLIC_KEY_IN_BASE58 = new PublicKey(ADMIN_PUBLIC_KEY).toBase58();

export async function serverLogin(): Promise<string> {
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
		const encodedCRSFToken = new TextEncoder().encode(csrfToken);

		const shouldWork = bs58.decode(adminSignedMessage);

		console.log("verifyAdminSignature called")

		console.log("PUBLICKEY BYTES", ADMIN_PUBLIC_KEY_IN_BASE58)

		const adminPublicKeyInBase58 = bs58.decode(ADMIN_PUBLIC_KEY_IN_BASE58);

		return sign.detached.verify(
			encodedCRSFToken,
			shouldWork, // adminSignedMessage
			adminPublicKeyInBase58,
		);

	} catch (error) {
		return false;
	} finally {
		csrfToken = randomBytes(32).toString("hex");
	}
}
