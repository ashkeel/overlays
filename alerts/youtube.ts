import { OBS } from '../lib/connection-utils';
import { createPlayer } from '../lib/player';
import { ShitpostRedeem } from './types';
import OBSWebSocket from 'obs-websocket-js';

let ytplayer: YT.Player;

let obs: OBSWebSocket = null;

export function killPlayer() {
  ytplayer.destroy();
  ytplayer = null;
  if (obs) obs.send('SetMute', { source: 'BGM', mute: false });
}

export async function playShitpost(alert: ShitpostRedeem): Promise<void> {
  if (ytplayer) {
    killPlayer();
  }

  document.querySelector('.fancyname').textContent = alert.user;
  document.querySelector('.unfancyname').textContent = alert.user;
  let started = false;
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
}

export async function initOBS() {
  // Connect to OBS
  try {
    obs = await OBS();
  } catch (e) {
    console.warn('OBS not found, disabling OBS integration');
  }
}
