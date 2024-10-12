import anime from "animejs";
import { Howl } from "howler";
import JSConfetti from "js-confetti";
import { delay } from "../lib/sync";
import { animate } from "../alerts/sync";
import $el from "../lib/domutils";

import drop from "../assets/sounds/airhornplus.mp3";
import muzik from "../assets/sounds/okcut.mp3";
import tick from "../assets/sounds/tick.wav";

const wheelSprite = new Howl({ src: [tick] });
const dropSprite = new Howl({ src: [drop] });
const musicSprite = new Howl({ src: [muzik] });
const jsConfetti = new JSConfetti();

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

function createWheel(values: string[]) {
	const wheel = $el("div", { className: "wheel" });
	const arrow = $el("div", { className: "wheel-arrow" }, "☛");
	const inner = $el("div", { className: "wheel-inner" });
	const rotate = $el("div", { className: "wheel-inner-rotate" });
	const angle = 360 / values.length;
	const diameter = 1000;
	const radius = diameter / 2;
	const circumference = Math.PI * diameter;
	const height = circumference / values.length;
	const heightStr = `-${height}px`;
	inner.style.marginTop = heightStr;
	values.forEach((value, index) => {
		const slice = $el("div", { className: `slice slice-${index}` }, value);
		slice.style.transform = `rotateX(${
			angle * index
		}deg) translateZ(${radius}px)`;
		slice.style.height = heightStr;
		rotate.appendChild(slice);
	});
	inner.appendChild(rotate);
	wheel.appendChild(inner);
	wheel.appendChild(arrow);
	return { wheel, rotationBase: rotate };
}

export async function spin(
	root: HTMLElement,
	name: string,
	picks: string[],
	onPick?: (pick: string) => void,
) {
	// Create header and animate it in
	const header = animScript(name);
	root.appendChild(header);
	animate({
		targets: header.querySelectorAll(".letter"),
		translateX: 150,
		translateY: 160,
		rotate: "1turn",
		duration: 800,
		easing: "easeOutCubic",
		delay: anime.stagger(50),
	});

	// Start muzik
	const spriteNum = musicSprite.play();
	setTimeout(() => musicSprite.fade(1, 0, 400, spriteNum), 22000);

	// Create wheel and animate it in
	const { wheel, rotationBase } = createWheel(picks);
	root.appendChild(wheel);
	await delay(1000);
	animate({
		targets: wheel,
		left: 30,
		duration: 2000,
	});

	// Create pointing hand and animate and make it go "tick"
	const angle = 360 / picks.length;
	const arrow = document.querySelector(".wheel-arrow");
	const itemID = Math.trunc(Math.random() * picks.length);
	let lastRotation = 0;
	let tickLoop = true;
	const ticker = () => {
		if (tickLoop) requestAnimationFrame(ticker);
		const rot = rotationBase.style.transform.match(/rotateX\((.*)deg/);
		if (rot) {
			const rotation = Number.parseFloat(rot[1]);
			if (rotation - lastRotation >= angle) {
				lastRotation = rotation;
				animate({
					targets: arrow,
					keyframes: [{ rotate: -10 }, { rotate: 0 }],
					duration: 100,
					easing: "easeOutCubic",
				});
				wheelSprite.play();
			}
		}
	};
	requestAnimationFrame(ticker);

	// SPIN DA WHEEEEEEEEEEEEEL
	await animate({
		targets: rotationBase,
		rotateX: 360 * 6 + (picks.length - itemID) * angle,
		duration: 20000,
		easing: "easeOutCubic",
	});
	tickLoop = false;

	// Set winner tile as super fancy and play horns
	const winner = wheel.querySelector(`.slice-${itemID}`);
	winner.classList.add("active");
	// CONFETTISSS
	setTimeout(
		() =>
			jsConfetti.addConfetti({
				confettiColors: [
					"#ff0a54",
					"#ff477e",
					"#ff7096",
					"#ff85a1",
					"#fbb1bd",
					"#f9bec7",
				],
			}),
		200,
	);
	dropSprite.play();
	await animate({
		targets: winner,
		keyframes: [
			{ scaleX: 1.2, scaleY: 1, rotateZ: 0 },
			{ scaleX: 1.1, scaleY: 1.2, rotateZ: -10 },
			{ scaleX: 1.2, scaleY: 1.1, rotateZ: 10 },
			{ scaleX: 1, scaleY: 1.2 },
			{ scaleX: 1, scaleY: 1, rotateZ: 360 },
		],
		duration: 1000,
		easing: "easeOutCubic",
	});

	if (onPick) {
		onPick(winner.innerHTML);
	}

	// Wait a bit
	await delay(7000);

	// Fade out everything!!!!!
	animate({
		targets: header.querySelectorAll(".letter"),
		translateX: -150,
		translateY: -160,
		rotate: "1turn",
		duration: 800,
		easing: "easeOutCubic",
		delay: anime.stagger(50),
	});
	animate({
		targets: wheel,
		left: -1000,
		duration: 2000,
	});
	root.removeChild(header);
	root.removeChild(wheel);
}
