"use server";

let lastId = 0;

const SUCCESS = true;
const FAILURE = false;

export async function getLastIDFromServer() {
	return lastId;
}

export async function incrementTheServerLastID(): Promise<boolean> {
	try {
		lastId += 1;
		return SUCCESS;
	} catch (error) {
		return FAILURE;
	}
}

export async function setTheServerLastID(value: number): Promise<boolean> {
	try {
		lastId = value;
		return SUCCESS;
	} catch (error) {
		return FAILURE;
	}
}
