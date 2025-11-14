import { EventSubscription } from "obs-websocket-js";
import { OBS } from "../lib/connection-utils";

interface InputLevelEntry {
	inputLevelsMul: [number[], number[]];
	inputName: string;
	inputUuid: string;
}

const jsonEl = document.getElementById("debug-json");
const debugBar = document.getElementById("debug-bar");

async function run() {
	const obs = await OBS({
		eventSubscriptions: EventSubscription.InputVolumeMeters,
	});

	obs.on("InputVolumeMeters", (meters) => {
		// Generated type is stupid, we like good types in this house >:(
		const inputs = meters.inputs as unknown as InputLevelEntry[];

		const mic = inputs.find(
			(i) => i.inputUuid === "15a705f2-adb2-4249-9a72-e9032b31591d",
		);
		if (!mic) {
			return;
		}

		jsonEl.innerHTML = JSON.stringify(mic, null, 2);
		const micLevel = mic.inputLevelsMul[0]?.[2] || 0;
		debugBar.style.width = `${micLevel * 800}px`;
	});
}

run();
