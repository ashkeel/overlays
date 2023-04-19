/* eslint-disable import/no-unresolved */
/* eslint-disable default-case */
import '../lib/sentry';

import { Strimertul } from '@strimertul/strimertul';
import {
  CustomRewardRedemptionEvent,
  EventSubEvent,
} from '../lib/twitch-types';
//import OBSWebSocket from 'obs-websocket-js';
import { Kilovolt } from '../lib/connection-utils';

// @ts-expect-error Assets
import * as videos from './shitposts/*';
// @ts-expect-error More assets!
import * as longvideos from './long/*';

async function run() {
  // Connect to strimertul and OBS
  const kv = await Kilovolt();
  const strimertul = new Strimertul({ kv });

  // Start subscription for twitch events
  strimertul.twitch.event.onRedeem(async (ev) => {
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

//let obs: OBSWebSocket = null;

const videoEl = document.querySelector('#player');
const player = document.querySelector<HTMLVideoElement>('#videoplayer');
player.addEventListener('ended', () => {
  document
    .querySelectorAll('.ytbox')
    .forEach((yt) => yt.classList.replace('fadein', 'fadeout'));
  videoEl.classList.remove('show');
  //if (obs) obs.send('SetMute', { source: 'BGM', mute: false });
});
export async function playShitpost(name: string): Promise<void> {
  document.querySelector('.fancyname').textContent = name;
  document.querySelector('.unfancyname').textContent = name;
  let chosenvideos = videos;
  let special = false;
  // 1% chance to roll LOOOOONG videos
  if (Math.random() < 0.01) {
    chosenvideos = longvideos;
    special = true;
  }
  const videoURLs = Object.values(chosenvideos);
  const randomVideo = videoURLs[
    Math.trunc(Math.random() * videoURLs.length)
  ] as string;
  player.src = randomVideo;
  document.querySelectorAll('.ytbox').forEach((yt) => {
    yt.classList.remove('fadeout');
    yt.classList.add('fadein');
    if (special) {
      yt.classList.add('special');
      document.querySelector('.redeem-tx').innerHTML = 'LUCKY!!! ';
    } else {
      yt.classList.remove('special');
      document.querySelector('.redeem-tx').innerHTML = 'Thanks ';
    }
  });
  videoEl.classList.add('show');
  //if (obs) obs.send('SetMute', { source: 'BGM', mute: true });
  player.play();
}

run();
