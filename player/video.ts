/* eslint-disable import/no-unresolved */
/* eslint-disable default-case */
import '../lib/sentry';

import {
  CustomRewardRedemptionEvent,
  EventSubEvent,
} from '../lib/twitch-types';
import OBSWebSocket from 'obs-websocket-js';
import { Kilovolt, OBS } from '../lib/connection-utils';

// @ts-expect-error Assets
import * as videos from './videos/*';

async function run() {
  // Connect to strimertul and OBS
  const server = await Kilovolt();
  await initOBS();

  // Start subscription for twitch events
  server.subscribeKey('stulbe/ev/webhook', async (newValue) => {
    const ev = JSON.parse(newValue) as EventSubEvent;
    switch (ev.subscription.type) {
      case 'channel.channel_points_custom_reward_redemption.add': {
        const redeem = ev as CustomRewardRedemptionEvent;
        switch (redeem.event.reward.id) {
          case '66ce0b06-1f39-4742-81c2-962dbf98fb06': // Shitpost time
            //TODO queue them up!
            playShitpost(redeem.event.user_name);
            break;
        }
      }
    }
  });
}

let obs: OBSWebSocket = null;

const player = document.querySelector<HTMLVideoElement>('#videoplayer');
player.addEventListener('ended', () => {
  document
    .querySelectorAll('.ytbox')
    .forEach((yt) => yt.classList.replace('fadein', 'fadeout'));
  document.querySelector('#player').classList.remove('show');
  if (obs) obs.send('SetMute', { source: 'BGM', mute: false });
});
export async function playShitpost(name: string): Promise<void> {
  document.querySelector('.fancyname').textContent = name;
  document.querySelector('.unfancyname').textContent = name;
  let started = false;
  const videoURLs = Object.values(videos);
  const randomVideo = videoURLs[
    Math.trunc(Math.random() * videoURLs.length)
  ] as string;
  player.src = randomVideo;
  document.querySelectorAll('.ytbox').forEach((yt) => {
    yt.classList.remove('fadeout');
    yt.classList.add('fadein');
  });
  document.querySelector('#player').classList.add('show');
  if (obs) obs.send('SetMute', { source: 'BGM', mute: true });
  player.play();
}

export async function initOBS() {
  // Connect to OBS
  try {
    obs = await OBS();
  } catch (e) {
    console.warn('OBS not found, disabling OBS integration');
  }
}

run();
