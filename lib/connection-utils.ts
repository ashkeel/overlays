import KilovoltWS from "@strimertul/kilovolt-client";
import ObsWebSocket from "obs-websocket-js";

type IdentificationParams = Parameters<ObsWebSocket["connect"]>[2];

export async function OBS(params: IdentificationParams = {}): Promise<ObsWebSocket> {
	const obs = new ObsWebSocket();
	await obs.connect(
		import.meta.env.VITE_OBS_ENDPOINT,
		import.meta.env.VITE_OBS_PASSWORD,
		params
	);
	return obs;
}

export async function Kilovolt(): Promise<KilovoltWS> {
	const kv = new KilovoltWS(import.meta.env.VITE_KILOVOLT_ENDPOINT, {
		reconnect: true,
		password: import.meta.env.VITE_KILOVOLT_PASSWORD,
	});
	await kv.connect();
	return kv;
}

export default { OBS, Kilovolt };
