import { Howl } from 'howler';
import { Strimertul } from '@strimertul/strimertul';
import { animate } from '../alerts/sync';
import { Kilovolt } from '../lib/connection-utils';
import { $el } from '../lib/domutils';
import { delay } from '../lib/sync';

//@ts-expect-error asset
import vineBoom from 'url:./sounds/vineboom.mp3';
//@ts-expect-error asset
import zelko from 'url:./sounds/zelko.mp3';
//@ts-expect-error asset
import sentai from 'url:./sounds/sentai.mp3';
//@ts-expect-error asset
import cyg from 'url:./sounds/cyg.ogg';
//@ts-expect-error asset
import sonicchan from 'url:./sounds/sonicchan.ogg';
//@ts-expect-error asset
import catboy from 'url:./sounds/catboy.ogg';

import anime from 'animejs';

const vineBoomSound = new Howl({ src: [vineBoom] });

const sounds = {
  zelkovatype8: new Howl({ src: [zelko] }),
  sentai_vt: new Howl({ src: [sentai] }),
  cygnuspykeman: new Howl({ src: [cyg] }),
  enfieldvt: new Howl({ src: [catboy] }),
  sonic_chan: new Howl({ src: [sonicchan] }),
};

let lastMessageTable: Record<string, number> = {};

const isOldEnough = (timestamp: number) =>
  Date.now() - timestamp > 12 * 60 * 60 * 1000;

const randPX = (base: number, amount: number) =>
  `${Math.trunc(Math.random() * amount + base)}px`;

function makeWalkInPopup(name: string) {
  const el = $el(
    'div',
    {
      className: 'walkin',
    },
    'Hello ',
    ['span', { className: 'name' }, name],
    '!'
  );
  el.style.top = randPX(-220, 400);
  el.style.left = randPX(-220, 400);
  return el;
}

async function popup(name: string) {
  if (name in sounds) {
    sounds[name].play();
  } else {
    vineBoomSound.play();
  }
  const el = makeWalkInPopup(name);
  document.body.appendChild(el);
  await animate({
    targets: el,
    translateX: 250,
    translateY: 260,
    rotate: '1turn',
    duration: 800,
    easing: 'easeOutCubic',
  });
  await delay(2000);
  await animate({
    targets: el,
    duration: 400,
    easing: 'easeOutCubic',
    scaleX: 0.8,
    scaleY: 0.4,
    opacity: 0,
    rotate: () => `20deg`,
    translateX: () => anime.random(-170, -122),
    translateY: () => anime.random(-160, -120),
  });
}

const storeKey = 'overlay/regulars/lastMessage';

async function run() {
  // Connect to server
  const kv = await Kilovolt();
  const strimertul = new Strimertul({ kv });

  try {
    lastMessageTable = await kv.getJSON(storeKey);
  } catch (e) {
    lastMessageTable = {};
  }
  strimertul.twitch.chat.onMessage((messageData) => {
    const name = messageData.User.Name;
    if (!(name in sounds)) {
      return;
    }
    const hasWalkedIn =
      name in lastMessageTable ? isOldEnough(lastMessageTable[name]) : true;
    if (hasWalkedIn) {
      popup(name);
      lastMessageTable[name] = Date.now();
      kv.putJSON(storeKey, lastMessageTable);
    }
  });
}

run();
