import { createPlayer } from '../lib/player';
import type { ShitpostRedeem } from './types';

let ytplayer: YT.Player;

export function killPlayer() {
  ytplayer.destroy();
  ytplayer = null;
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
        // biome-ignore lint/complexity/noForEach: NodeList
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
        // biome-ignore lint/complexity/noForEach: NodeList
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
