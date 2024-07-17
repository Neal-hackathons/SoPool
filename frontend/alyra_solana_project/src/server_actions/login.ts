"use server";
import { PublicKey } from "@solana/web3.js";
import { sign } from "tweetnacl";

let csrfToken: string | undefined;

const ADMIN_PUBLIC_KEY = process.env.ADMIN_PUBLIC_KEY as string;

const ADMIN_PUBLIC_KEY_BYTES = new PublicKey(ADMIN_PUBLIC_KEY).toBytes();

export async function serverLogin(): Promise<string> {
	csrfToken = crypto.randomUUID().slice(0,10);
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

	if (ADMIN_PUBLIC_KEY === undefined || ADMIN_PUBLIC_KEY_BYTES === undefined) {
		return false;
	}

	try {
		const encodedCRSFToken = new TextEncoder().encode(csrfToken);

		const damn = new TextEncoder().encode(adminSignedMessage);

		console.log("damn!!!!!!!!!!!", damn[0]);

		return sign.detached.verify(
			encodedCRSFToken,
			damn, // adminSignedMessage
			ADMIN_PUBLIC_KEY_BYTES,
		);
	} catch (error) {
		return false;
	} finally {
		csrfToken = crypto.randomUUID().slice(0,10);
	}
}
