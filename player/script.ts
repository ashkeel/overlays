/* eslint-disable import/no-unresolved */
/* eslint-disable default-case */
import '../lib/sentry';

import {
  CustomRewardRedemptionEvent,
  EventSubEvent,
} from '../lib/twitch-types';
import { createPlayer } from '../lib/player';
import OBSWebSocket from 'obs-websocket-js';
import { Kilovolt, OBS } from '../lib/connection-utils';

import * as videos from './videos/*';

let isPlaying = false;

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
            playShitpost(redeem.event.user_name);
            break;
        }
      }
    }
  });
}

let obs: OBSWebSocket = null;

export function killPlayer() {
  if (obs) obs.send('SetMute', { source: 'BGM', mute: false });
}

const player = document.querySelector<HTMLVideoElement>('#videoplayer');
export async function playShitpost(name: string): Promise<void> {
  document.querySelector('.fancyname').textContent = name;
  document.querySelector('.unfancyname').textContent = name;
  let started = false;
  console.log();
  /*
  ytplayer = await createPlayer('PLZif5HUa3oJ_7UZiT_rxxjCiM_5Z7OkHP', {
    loop: false,
    onStateChange: (ev: YT.OnStateChangeEvent) => {
      console.log(ev);
      if (ev.data === YT.PlayerState.PLAYING) {
        started = true;
        if (obs) obs.send('SetMute', { source: 'BGM', mute: true });
        document.querySelectorAll('.ytbox').forEach((yt) => {
          yt.classList.remove('fadeout');
          yt.classList.add('fadein');
        });
        document.querySelector('#player').classList.add('show');
        return;
      }
      if (
        (started && ev.data === YT.PlayerState.UNSTARTED) ||
        ev.data === YT.PlayerState.ENDED
      ) {
        document
          .querySelectorAll('.ytbox')
          .forEach((yt) => yt.classList.replace('fadein', 'fadeout'));
        ytplayer.pauseVideo();
        document.querySelector('#player').classList.remove('show');
        setTimeout(killPlayer, 1000);
      }
    },
  });
  */
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
playShitpost('test');
