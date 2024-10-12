import { Kilovolt } from "../lib/connection-utils";
import type KilovoltWS from "@strimertul/kilovolt-client";

const videos = import.meta.glob("./shitposts/*", { as: "url", eager: true });
const longvideos = import.meta.glob("./long/*", { as: "url", eager: true });

function parseURL(url: string) {
	const parts = url.split("/");
	return decodeURI(parts[parts.length - 1]);
}

function makeShitpostList(kv: KilovoltWS, entries: string[]) {
	const ul = document.querySelector<HTMLUListElement>("#shitpost-list");
	ul.innerHTML = "";
	for (const url of entries) {
		const li = document.createElement("li");
		li.textContent = parseURL(url);
		li.addEventListener("click", async () => {
			await kv.putKey("overlay/@play-shitpost", url);
		});
		ul.appendChild(li);
	}
}

async function run() {
	// Connect to strimertul
	const kv = await Kilovolt();

	const lastShitpostEl =
		document.querySelector<HTMLInputElement>("#last-shitpost");

	lastShitpostEl.value = await kv.getKey("overlays/last-shitpost");
	kv.subscribeKey("overlays/last-shitpost", (newVal) => {
		lastShitpostEl.value = newVal;
	});

	document
		.querySelector<HTMLButtonElement>("#replay-last")
		.addEventListener("click", async () => {
			await kv.putKey("overlay/@play-shitpost", lastShitpostEl.value);
		});

	const select = document.querySelector<HTMLSelectElement>("#replay-select");
	for (const url of Object.values(videos)) {
		const opt = document.createElement("option");
		opt.value = url;
		opt.textContent = parseURL(url);
		select.appendChild(opt);
	}
	// Add divider
	select.appendChild(document.createElement("hr"));
	for (const url of Object.values(longvideos)) {
		const opt = document.createElement("option");
		opt.value = url;
		opt.textContent = parseURL(url);
		select.appendChild(opt);
	}

	document
		.querySelector<HTMLButtonElement>("#replay-selected")
		.addEventListener("click", async () => {
			await kv.putKey("overlay/@play-shitpost", select.value);
		});

	const list = await kv.getJSON<string[]>("overlays/last-shitpost-list");
	makeShitpostList(kv, list);
	kv.subscribeKey("overlays/last-shitpost-list", (newVal) => {
		const list = JSON.parse(newVal);
		makeShitpostList(kv, list);
	});
}

run();
