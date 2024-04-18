/* eslint-disable import/no-unresolved */
/* eslint-disable default-case */
import '../lib/sentry';

import { Kilovolt } from '../lib/connection-utils';
import type KilovoltWS from '@strimertul/kilovolt-client';
import { CustomRewardRedemptionEvent } from 'lib/twitch-types.ts';

const videos = import.meta.glob('./shitposts/*', { as: 'url', eager: true });
const longvideos = import.meta.glob('./long/*', { as: 'url', eager: true });

async function run() {
  // Connect to strimertul
  const kv = await Kilovolt();

  // Start subscription for twitch events
  kv.subscribeKey(
    'twitch/ev/eventsub-event/channel.channel_points_custom_reward_redemption.add',
    (newVal) => {
      const redeem = JSON.parse(newVal) as CustomRewardRedemptionEvent;
      switch (redeem.event.reward.id) {
        case '66ce0b06-1f39-4742-81c2-962dbf98fb06': // Shitpost time
          //TODO queue them up!
          playRandomShitpost(kv, redeem.event.user_name);
          break;
      }
    }
  );

  kv.subscribeKey('overlay/@play-shitpost', (newVal) => {
    playShitpost(VideoCause.Replay, 'INSTANT REPLAY', newVal);
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
export async function playRandomShitpost(
  kv: KilovoltWS,
  name: string
): Promise<void> {
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

  // This is the worst code I've written in a long while
  const lastShitpostList = await kv.getKey('overlays/last-shitpost-list');
  const shitpostList = [
    ...JSON.parse(lastShitpostList || '[]'),
    randomVideo,
  ].slice(-10);

  await kv.putKeys({
    'overlays/last-shitpost': randomVideo,
    'overlays/last-shitpost-list': JSON.stringify(shitpostList),
  });

  playShitpost(VideoCause.Redeem, name, randomVideo, special);
}

enum VideoCause {
  Redeem,
  Replay,
}

export async function playShitpost(
  cause: VideoCause,
  name: string,
  video: string,
  lucky: boolean = false
) {
  document.querySelector('.fancyname').textContent = name;
  document.querySelector('.unfancyname').textContent = name;
  player.src = video;

  document.querySelectorAll('.ytbox').forEach((yt) => {
    yt.classList.remove('fadeout', 'special', 'replay');
    yt.classList.add('fadein');
    if (cause == VideoCause.Replay) {
      yt.classList.add('replay');
      document.querySelector('.redeem-tx').innerHTML = '';
    } else if (lucky) {
      yt.classList.add('special');
      document.querySelector('.redeem-tx').innerHTML = 'LUCKY!!! ';
    } else {
      document.querySelector('.redeem-tx').innerHTML = 'Thanks ';
    }
  });
  videoEl.classList.add('show');
  //if (obs) obs.send('SetMute', { source: 'BGM', mute: true });
  player.play();
}

run();
