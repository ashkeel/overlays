/* eslint-disable import/no-unresolved */
/* eslint-disable default-case */
import '../lib/sentry';

// @ts-expect-error Assets
import * as videos from './brb/*';

const videoURLs = Object.values(videos);
const randomVideo = videoURLs[
  Math.trunc(Math.random() * videoURLs.length)
] as string;
const player = document.querySelector<HTMLVideoElement>('video');
player.src = randomVideo;
player.play();
