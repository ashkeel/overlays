import { Filter } from "bad-words";
import * as tts from "@diffusionstudio/vits-web";
import { Kilovolt } from "../lib/connection-utils";
import type { CustomRewardRedemptionEvent } from "../lib/twitch-types";

type BskyPost =
	| {
			did: string;
			time_us: number;
			kind: "commit";
			commit: {
				record?: {
					$type: "app.bsky.feed.post";
					createdAt: string;
					langs?: string[];
					text: string;
				};
			};
	  }
	| { kind: "identity" };

const filter = new Filter();

// fuck politics
filter.addWords("project 2025", "trump", "joe", "white house", "government");

const lookFor = [
	//"maybe",
	"inconclusive",
	"probably yes",
	"probably not",
	"try again",
	"most likely",
	"definitely so",
	"definitely yes",
	"definitely not",
	"absolutely not",
	"absolutely so",
	"it will never happen",
	"doubtful",
	"outlook good",
	"outlook not",
	"don't count on it",
	"signs point to",
	"as I see it",
	"i'm sure",
];

const VOICE_NAME = "en_US-hfc_male-medium";

async function getNextReply(): Promise<string> {
	return new Promise((resolve) => {
		const ws = new WebSocket(
			"wss://jetstream2.us-west.bsky.network/subscribe?wantedCollections=app.bsky.feed.post",
		);

		ws.onmessage = (ev) => {
			const data = JSON.parse(ev.data) as BskyPost;

			if (data.kind !== "commit") return;
			if (!data.commit.record?.langs?.includes("en")) return;

			const text = data.commit.record.text;
			if (
				text.toLowerCase().includes("http") ||
				text.toLowerCase().includes("www.") ||
				text.length < 3 ||
				text.length > 80
			) {
				return;
			}

			if (lookFor.some((look) => text.toLowerCase().includes(look))) {
				const filtered = filter
					.clean(data.commit.record.text)
					.replace(/\*+/g, "BAZINGA");

				ws.close();
				resolve(filtered);
			}
		};
	});
}

const form = document.querySelector<HTMLFormElement>("form");
const label = document.querySelector<HTMLSpanElement>("#label");
const response = document.querySelector<HTMLInputElement>("#response");

async function predict(): Promise<string> {
	form.classList.remove("fadeout");
	form.classList.add("visible");

	const reply = await getNextReply();

	const wav = await tts.predict({
		text: reply,
		voiceId: VOICE_NAME,
	});

	setTimeout(() => {
		const audio = new Audio();
		audio.src = URL.createObjectURL(wav);
		audio.play();

		audio.onended = () => {
			setTimeout(() => {
				response.checked = false;
				form.classList.replace("visible", "fadeout");
			}, 1500);
		};
	}, 2000);

	label.innerHTML = reply;
	form.classList.add("zoomed");
	response.checked = true;

	return reply;
}

async function run() {
	// Download chosen voice if not stored
	const voices = await tts.stored();
	if (!voices.includes(VOICE_NAME)) {
		await tts.download(VOICE_NAME, (progress) => {
			console.log(
				`Downloading ${progress.url} - ${Math.round((progress.loaded * 100) / progress.total)}%`,
			);
		});
	}

	// Connect to strimertul
	const kv = await Kilovolt();

	// Start subscription for twitch events
	kv.subscribeKey(
		"twitch/ev/eventsub-event/channel.channel_points_custom_reward_redemption.add",
		async (newVal) => {
			const redeem = JSON.parse(newVal) as CustomRewardRedemptionEvent;
			console.log(redeem);
			switch (redeem.event.reward.id) {
				case "7db27d86-3dbe-4301-b0ff-b8a3210e5526": {
					// Magic 8 ball time
					const message = await predict();
					kv.putJSON("twitch/chat/@send-message", {
						message: `Magic skyball says: ${message}`,
					});
				}
			}
		},
	);
}
run();
