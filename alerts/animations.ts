import { animate, random, stagger } from "animejs";
import { Howl } from "howler";
import followWoosh from "../assets/sounds/follow-woosh.wav";
import { $el } from "../lib/domutils";
import { delay } from "../lib/sync";
import type { CheerAlert, RaidAlert, SubAlert } from "./types";

const followSprite = new Howl({ src: [followWoosh] });

const staging = document.getElementById("backstage");

// Create letters to be animated
function animScript(text: string): HTMLElement {
	const letters = text
		.split("")
		.map((letter, i) =>
			$el(
				"div",
				{ className: letter.trim().length < 1 ? "letter space" : "letter" },
				$el(
					"div",
					{ className: "inner", style: `animation-delay: ${300 * i}ms` },
					letter,
				),
			),
		);
	return $el("div", { className: "anim-wrapper" }, ...letters);
}

export async function subAnim(alertData: SubAlert) {
	let div: HTMLElement = null;
	if (alertData.total) {
		div = animScript("Resub ");
		const months = animScript(`${alertData.total} months`);
		while (months.firstElementChild) {
			months.firstElementChild.className = "letter smol";
			div.appendChild(months.firstElementChild);
		}
	} else {
		div = animScript("New sub");
	}
	staging.appendChild(div);
	followSprite.play();
	await animate(div.querySelectorAll(".letter"), {
		translateX: -150,
		translateY: -160,
		rotate: "1turn",
		duration: 800,
		easing: "easeOutCubic",
		delay: stagger(50),
	});
	await delay(1700);
	animate(div.querySelectorAll(".letter"), {
		duration: 400,
		translateX: -180,
		translateY: -220,
		easing: "easeOutBack",
		fontSize: "35pt",
		delay: 200,
	});
	const userdiv = animScript(alertData.user);
	staging.appendChild(userdiv);
	animate(userdiv.querySelectorAll(".letter"), {
		translateX: -150,
		translateY: -160,
		rotate: "1turn",
		duration: 400,
		easing: "easeOutCubic",
		delay: stagger(50),
	});
	await delay(3000);
	await animate(
		[div.querySelectorAll(".letter"), userdiv.querySelectorAll(".letter")],
		{
			duration: 200,
			easing: "easeOutCubic",
			scaleX: 0.8,
			scaleY: 0,
			rotate: () => `${random(0, 40)}deg`,
			translateX: () => random(-170, -220),
			translateY: () => random(-160, -200),
			delay: stagger(20),
		},
	);
	staging.removeChild(div);
}

export async function raidAnim(alertData: RaidAlert) {
	const div = animScript("Raid ");
	const months = animScript(`${alertData.viewers} viewers`);
	while (months.firstElementChild) {
		months.firstElementChild.className = "letter smol";
		div.appendChild(months.firstElementChild);
	}
	staging.appendChild(div);
	followSprite.play();
	await animate(div.querySelectorAll(".letter"), {
		translateX: -150,
		translateY: -160,
		rotate: "1turn",
		duration: 800,
		easing: "easeOutCubic",
		delay: stagger(50),
	});
	await delay(1700);
	animate(div.querySelectorAll(".letter"), {
		duration: 400,
		translateX: -180,
		translateY: -220,
		easing: "easeOutBack",
		fontSize: "35pt",
		delay: 200,
	});
	const userdiv = animScript(alertData.user);
	staging.appendChild(userdiv);
	animate(userdiv.querySelectorAll(".letter"), {
		translateX: -150,
		translateY: -160,
		rotate: "1turn",
		duration: 400,
		easing: "easeOutCubic",
		delay: stagger(50),
	});
	await delay(3000);
	await animate(
		[div.querySelectorAll(".letter"), userdiv.querySelectorAll(".letter")],
		{
			duration: 200,
			easing: "easeOutCubic",
			scaleX: 0.8,
			scaleY: 0,
			rotate: () => `${random(0, 40)}deg`,
			translateX: () => random(-170, -220),
			translateY: () => random(-160, -200),
			delay: stagger(20),
		},
	);
	staging.removeChild(div);
}

export async function cheerAnim(alertData: CheerAlert) {
	const div = animScript("Cheer ");
	const months = animScript(`${alertData.amount} bits`);
	while (months.firstElementChild) {
		months.firstElementChild.className = "letter smol";
		div.appendChild(months.firstElementChild);
	}
	staging.appendChild(div);
	followSprite.play();
	await animate(div.querySelectorAll(".letter"), {
		translateX: -150,
		translateY: -160,
		rotate: "1turn",
		duration: 800,
		easing: "easeOutCubic",
		delay: stagger(50),
	});
	await delay(1700);
	animate(div.querySelectorAll(".letter"), {
		duration: 400,
		translateX: -180,
		translateY: -220,
		easing: "easeOutBack",
		fontSize: "35pt",
		delay: 200,
	});
	const userdiv = animScript(alertData.user);
	staging.appendChild(userdiv);
	animate(userdiv.querySelectorAll(".letter"), {
		translateX: -150,
		translateY: -160,
		rotate: "1turn",
		duration: 400,
		easing: "easeOutCubic",
		delay: stagger(50),
	});
	await delay(3000);
	await animate(
		[div.querySelectorAll(".letter"), userdiv.querySelectorAll(".letter")],
		{
			duration: 200,
			easing: "easeOutCubic",
			scaleX: 0.8,
			scaleY: 0,
			rotate: () => `${random(0, 40)}deg`,
			translateX: () => random(-170, -220),
			translateY: () => random(-160, -200),
			delay: stagger(20),
		},
	);
	staging.removeChild(div);
}
