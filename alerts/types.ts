import type { SubscriptionMessage } from "../lib/twitch-types";

export interface FollowAlert {
	type: "follow";
	user: string;
}

export interface SubAlert {
	type: "sub";
	user: string;
	gift: boolean;
	tier: string;
	message?: SubscriptionMessage;
	total?: number;
	streak?: number;
}

export interface CheerAlert {
	type: "cheer";
	user?: string;
	message?: string;
	amount: number;
}

export interface RaidAlert {
	type: "raid";
	user: string;
	viewers: number;
}

export interface ShitpostRedeem {
	type: "redeem-shitpost";
	user: string;
}

export type AlertData =
	| FollowAlert
	| SubAlert
	| CheerAlert
	| RaidAlert
	| ShitpostRedeem;
