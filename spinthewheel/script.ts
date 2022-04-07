import Kilovolt from '@strimertul/kilovolt-client';
import anime from 'animejs';
import { Howl } from 'howler';
import JSConfetti from 'js-confetti';
import {
  CustomRewardRedemptionEvent,
  EventSubEvent,
} from 'lib/twitch-types.ts';
//@ts-expect-error asset
import drop from 'url:../assets/sounds/airhornplus.mp3';
//@ts-expect-error asset
import muzik from 'url:../assets/sounds/okcut.mp3';
//@ts-expect-error asset
import tick from 'url:../assets/sounds/tick.wav';
import { animate, delay } from '../alerts/sync';
import { Kilovolt as KV } from '../lib/connection-utils';
import { $el } from '../lib/domutils';

const wheelSprite = new Howl({ src: [tick] });
const dropSprite = new Howl({ src: [drop] });
const musicSprite = new Howl({ src: [muzik] });
const jsConfetti = new JSConfetti();

const values = [
  'Opus Magnum Sigmar Garden',
  'Molek-Syntek Solitaire',
  'Pac-man CE NES',
  'Littlewood Tarott Master',
  'Super Auto Pets',
  'Frozen Synapse skirmish',
  'Yakuza 0 Pocket Circuit',
  'Super Hexagon',
  'Spin Rhythm XD',
  'Windjammers 2',
  'Jazztronauts',
  'Yakuza 0 Darts',
  'No Straight Roads Parry mode',
  'CrossCode Cave of Aspiration',
  'Shenzen I/O Solitaire',
  'Sonic Riders Battle',
  'Yakuza 0 Batting Cages',
  'SRB2Kart SPB Attack',
  'Bemuse.ninja',
  'Frozen Cortex skirmish',
  'PSO2 Boss',
  'Sonic GT challenge',
  'Alicia race',
  '.hack//GU Dungeon',
  'Diabotical Temple escape',
  'OSFE Shopkeeper 1',
  'Celeste C-side',
  'Flesh & Blood vs Bot',
  'Hyper Hexagonest 60sec run',
  'Inertial Drift challenge',
];

// Create letters to be animated
function animScript(text: string): HTMLElement {
  const letters = text
    .split('')
    .map((letter, i) =>
      $el(
        'div',
        { className: letter.trim().length < 1 ? 'letter space' : 'letter' },
        [
          'div',
          { className: 'inner', style: `animation-delay: ${300 * i}ms` },
          letter,
        ]
      )
    );
  return $el('div', { className: 'anim-wrapper' }, ...letters);
}

const main = document.querySelector('main');

function createWheel(values: string[]) {
  const wheel = $el('div', { className: 'wheel' });
  const arrow = $el('div', { className: 'wheel-arrow' }, '☛');
  const inner = $el('div', { className: 'wheel-inner' });
  const rotate = $el('div', { className: 'wheel-inner-rotate' });
  const angle = 360 / values.length;
  const diameter = 1000;
  const radius = diameter / 2;
  const circumference = Math.PI * diameter;
  const height = circumference / values.length;
  const heightStr = `-${height}px`;
  inner.style.marginTop = heightStr;
  values.forEach((value, index) => {
    const slice = $el('div', { className: `slice slice-${index}` }, value);
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

async function spin() {
  // Create header and animate it in
  const header = animScript('MINIGAME BREAK');
  main.appendChild(header);
  animate({
    targets: header.querySelectorAll('.letter'),
    translateX: 150,
    translateY: 160,
    rotate: '1turn',
    duration: 800,
    easing: 'easeOutCubic',
    delay: anime.stagger(50),
  });

  // Start muzik
  const spriteNum = musicSprite.play();
  setTimeout(() => musicSprite.fade(1, 0, 400, spriteNum), 22000);

  // Create wheel and animate it in
  const { wheel, rotationBase } = createWheel(values);
  main.appendChild(wheel);
  await delay(1000);
  animate({
    targets: wheel,
    left: 30,
    duration: 2000,
  });

  // Create pointing hand and animate and make it go "tick"
  const angle = 360 / values.length;
  const arrow = document.querySelector('.wheel-arrow');
  const itemID = Math.trunc(Math.random() * values.length);
  let lastRotation = 0;
  let tickLoop = true;
  const ticker = function () {
    if (tickLoop) requestAnimationFrame(ticker);
    const rot = rotationBase.style.transform.match(/rotateX\((.*)deg/);
    if (rot) {
      const rotation = parseFloat(rot[1]);
      if (rotation - lastRotation >= angle) {
        lastRotation = rotation;
        animate({
          targets: arrow,
          keyframes: [{ rotate: -10 }, { rotate: 0 }],
          duration: 100,
          easing: 'easeOutCubic',
        });
        wheelSprite.play();
      }
    }
  };
  requestAnimationFrame(ticker);

  // SPIN DA WHEEEEEEEEEEEEEL
  await animate({
    targets: rotationBase,
    rotateX: 360 * 6 + (values.length - itemID) * angle,
    duration: 20000,
    easing: 'easeOutCubic',
  });
  tickLoop = false;

  // Set winner tile as super fancy and play horns
  const winner = wheel.querySelector(`.slice-${itemID}`);
  winner.classList.add('active');
  // CONFETTISSS
  setTimeout(
    () =>
      jsConfetti.addConfetti({
        confettiColors: [
          '#ff0a54',
          '#ff477e',
          '#ff7096',
          '#ff85a1',
          '#fbb1bd',
          '#f9bec7',
        ],
      }),
    200
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
    easing: 'easeOutCubic',
  });

  server.putKey(
    'twitch/@send-chat-message',
    `Minigame break game: ${winner.innerHTML}`
  );

  // Wait a bit
  await delay(7000);

  // Fade out everything!!!!!
  animate({
    targets: header.querySelectorAll('.letter'),
    translateX: -150,
    translateY: -160,
    rotate: '1turn',
    duration: 800,
    easing: 'easeOutCubic',
    delay: anime.stagger(50),
  });
  animate({
    targets: wheel,
    left: -1000,
    duration: 2000,
  });
  main.removeChild(header);
  main.removeChild(wheel);
}

//spin();

let server: Kilovolt;

async function run() {
  // Connect to strimertul and OBS
  server = await KV();

  // Start subscription for twitch events
  server.subscribeKey('stulbe/ev/webhook', async (newValue) => {
    const ev = JSON.parse(newValue) as EventSubEvent;
    switch (ev.subscription.type) {
      case 'channel.channel_points_custom_reward_redemption.add': {
        const redeem = ev as CustomRewardRedemptionEvent;
        switch (redeem.event.reward.id) {
          case '7136dcc8-f1ec-4f75-93a5-e0da19f0bcff': // Minigame break
            spin();
            break;
        }
      }
    }
  });
}
run();
