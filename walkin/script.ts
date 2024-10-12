import { Howl } from "howler";
import { animate } from "../alerts/sync";
import { Kilovolt } from "../lib/connection-utils";
import { $el } from "../lib/domutils";
import { delay } from "../lib/sync";

import vineBoom from "./sounds/vineboom.mp3";
import zelko from "./sounds/zelko.mp3";
import sentai from "./sounds/sentai.mp3";
import cyg from "./sounds/cyg.ogg";
import sonicchan from "./sounds/sonicchan.ogg";
import catboy from "./sounds/catboy.ogg";
import selectoption from "./sounds/select_option.wav";

import anime from "animejs";

import type { TwitchEventSubChatMessage } from "chat/twitch.ts";

const vineBoomSound = new Howl({ src: [vineBoom] });

const sounds = {
	zel_hachigo: new Howl({ src: [zelko] }),
	sentai_vt: new Howl({ src: [sentai] }),
	cygnus_pikemen: new Howl({ src: [cyg] }),
	enfieldvt: new Howl({ src: [catboy] }),
	sonic_chan: new Howl({ src: [sonicchan] }),
	festivebop: new Howl({ src: [selectoption] }),
};

let lastMessageTable: Record<string, number> = {};

const isOldEnough = (timestamp: number) =>
	Date.now() - timestamp > 12 * 60 * 60 * 1000;

const randPX = (base: number, amount: number) =>
	`${Math.trunc(Math.random() * amount + base)}px`;

function makeWalkInPopup(name: string) {
	const el = $el(
		"div",
		{
			className: "walkin",
		},
		"Hello ",
		$el("span", { className: "name" }, name),
		"!",
	);
	el.style.top = randPX(-220, 400);
	el.style.left = randPX(-220, 400);
	return el;
}

async function popup(name: string) {
	if (name in sounds) {
		sounds[name].play();
	} else {
		vineBoomSound.play();
	}
	const el = makeWalkInPopup(name);
	document.body.appendChild(el);
	await animate({
		targets: el,
		translateX: 250,
		translateY: 260,
		rotate: "1turn",
		duration: 800,
		easing: "easeOutCubic",
	});
	await delay(2000);
	await animate({
		targets: el,
		duration: 400,
		easing: "easeOutCubic",
		scaleX: 0.8,
		scaleY: 0.4,
		opacity: 0,
		rotate: () => "20deg",
		translateX: () => anime.random(-170, -122),
		translateY: () => anime.random(-160, -120),
	});
}

const storeKey = "overlay/regulars/lastMessage";

async function run() {
	// Connect to server
	const kv = await Kilovolt();

	try {
		lastMessageTable = await kv.getJSON(storeKey);
	} catch (e) {
		lastMessageTable = {};
	}
	kv.subscribeKey("twitch/ev/eventsub-event/channel.chat.message", (newVal) => {
		const data = JSON.parse(newVal) as { event: TwitchEventSubChatMessage };
		const name = data.event.chatter_user_login;
		if (!(name in sounds)) {
			return;
		}
		const hasWalkedIn =
			name in lastMessageTable ? isOldEnough(lastMessageTable[name]) : true;
		if (hasWalkedIn) {
			popup(name);
			lastMessageTable[name] = Date.now();
			kv.putJSON(storeKey, lastMessageTable);
		}
	});
}

run();
