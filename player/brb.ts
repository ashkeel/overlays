import "../lib/sentry";

const videos = import.meta.glob("./brb/*", { as: "url", eager: true });

const videoURLs = Object.values(videos);
const randomVideo = videoURLs[
	Math.trunc(Math.random() * videoURLs.length)
] as string;
const player = document.querySelector<HTMLVideoElement>("video");
player.src = randomVideo;
player.play();
