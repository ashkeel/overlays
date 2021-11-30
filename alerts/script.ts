/* eslint-disable import/no-unresolved */
/* eslint-disable default-case */
import '../lib/sentry';
import '../lib/youtube-init';

import anime from 'animejs';
import { Howl } from 'howler';
import { $el } from '../lib/domutils';
import {
  CheerEvent,
  CustomRewardRedemptionEvent,
  EventSubEvent,
  FollowEvent,
  RaidEvent,
  ResubscriptionEvent,
  SubscriptionEvent,
} from '../lib/twitch-types';

// eslint-disable-next-line import/order
import followWoosh from '../assets/sounds/follow-woosh.wav';
import { Kilovolt } from '../lib/connection-utils';
import {
  AlertData,
  FollowAlert,
  SubAlert,
  RaidAlert,
  CheerAlert,
} from './types';
import { initOBS, playShitpost } from './youtube';
import { animate, delay } from './sync';

const alertQueue: AlertData[] = [];
let isPlaying = false;

const staging = document.getElementById('backstage');

const followSprite = new Howl({ src: [followWoosh] });

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

async function followAnim(alertData: FollowAlert) {
  const div = animScript('New follow');
  staging.appendChild(div);
  followSprite.play();
  await animate({
    targets: div.querySelectorAll('.letter'),
    translateX: -150,
    translateY: -160,
    rotate: '1turn',
    duration: 800,
    easing: 'easeOutCubic',
    delay: anime.stagger(50),
  });
  await delay(1700);
  anime({
    targets: div.querySelectorAll('.letter'),
    duration: 400,
    translateX: -180,
    translateY: -220,
    easing: 'easeOutBack',
    fontSize: '35pt',
    delay: 200,
  });
  const userdiv = animScript(alertData.user);
  staging.appendChild(userdiv);
  anime({
    targets: userdiv.querySelectorAll('.letter'),
    translateX: -150,
    translateY: -160,
    rotate: '1turn',
    duration: 400,
    easing: 'easeOutCubic',
    delay: anime.stagger(50),
  });
  await delay(3000);
  await animate({
    targets: [
      div.querySelectorAll('.letter'),
      userdiv.querySelectorAll('.letter'),
    ],
    duration: 200,
    easing: 'easeOutCubic',
    scaleX: 0.8,
    scaleY: 0,
    rotate: () => `${anime.random(0, 40)}deg`,
    translateX: () => anime.random(-170, -220),
    translateY: () => anime.random(-160, -200),
    delay: anime.stagger(20),
  });
  staging.removeChild(div);
  staging.removeChild(userdiv);
}

async function subAnim(alertData: SubAlert) {
  let div: HTMLElement = null;
  if (alertData.total) {
    div = animScript(`Resub `);
    const months = animScript(`${alertData.total} months`);
    while (months.firstElementChild) {
      months.firstElementChild.className = 'letter smol';
      div.appendChild(months.firstElementChild);
    }
  } else {
    div = animScript('New sub');
  }
  staging.appendChild(div);
  followSprite.play();
  await animate({
    targets: div.querySelectorAll('.letter'),
    translateX: -150,
    translateY: -160,
    rotate: '1turn',
    duration: 800,
    easing: 'easeOutCubic',
    delay: anime.stagger(50),
  });
  await delay(1700);
  anime({
    targets: div.querySelectorAll('.letter'),
    duration: 400,
    translateX: -180,
    translateY: -220,
    easing: 'easeOutBack',
    fontSize: '35pt',
    delay: 200,
  });
  const userdiv = animScript(alertData.user);
  staging.appendChild(userdiv);
  anime({
    targets: userdiv.querySelectorAll('.letter'),
    translateX: -150,
    translateY: -160,
    rotate: '1turn',
    duration: 400,
    easing: 'easeOutCubic',
    delay: anime.stagger(50),
  });
  await delay(3000);
  await animate({
    targets: [
      div.querySelectorAll('.letter'),
      userdiv.querySelectorAll('.letter'),
    ],
    duration: 200,
    easing: 'easeOutCubic',
    scaleX: 0.8,
    scaleY: 0,
    rotate: () => `${anime.random(0, 40)}deg`,
    translateX: () => anime.random(-170, -220),
    translateY: () => anime.random(-160, -200),
    delay: anime.stagger(20),
  });
  staging.removeChild(div);
}

async function raidAnim(alertData: RaidAlert) {
  const div = animScript(`Raid `);
  const months = animScript(`${alertData.viewers} viewers`);
  while (months.firstElementChild) {
    months.firstElementChild.className = 'letter smol';
    div.appendChild(months.firstElementChild);
  }
  staging.appendChild(div);
  followSprite.play();
  await animate({
    targets: div.querySelectorAll('.letter'),
    translateX: -150,
    translateY: -160,
    rotate: '1turn',
    duration: 800,
    easing: 'easeOutCubic',
    delay: anime.stagger(50),
  });
  await delay(1700);
  anime({
    targets: div.querySelectorAll('.letter'),
    duration: 400,
    translateX: -180,
    translateY: -220,
    easing: 'easeOutBack',
    fontSize: '35pt',
    delay: 200,
  });
  const userdiv = animScript(alertData.user);
  staging.appendChild(userdiv);
  anime({
    targets: userdiv.querySelectorAll('.letter'),
    translateX: -150,
    translateY: -160,
    rotate: '1turn',
    duration: 400,
    easing: 'easeOutCubic',
    delay: anime.stagger(50),
  });
  await delay(3000);
  await animate({
    targets: [
      div.querySelectorAll('.letter'),
      userdiv.querySelectorAll('.letter'),
    ],
    duration: 200,
    easing: 'easeOutCubic',
    scaleX: 0.8,
    scaleY: 0,
    rotate: () => `${anime.random(0, 40)}deg`,
    translateX: () => anime.random(-170, -220),
    translateY: () => anime.random(-160, -200),
    delay: anime.stagger(20),
  });
  staging.removeChild(div);
}

async function cheerAnim(alertData: CheerAlert) {
  const div = animScript(`Cheer `);
  const months = animScript(`${alertData.amount} bits`);
  while (months.firstElementChild) {
    months.firstElementChild.className = 'letter smol';
    div.appendChild(months.firstElementChild);
  }
  staging.appendChild(div);
  followSprite.play();
  await animate({
    targets: div.querySelectorAll('.letter'),
    translateX: -150,
    translateY: -160,
    rotate: '1turn',
    duration: 800,
    easing: 'easeOutCubic',
    delay: anime.stagger(50),
  });
  await delay(1700);
  anime({
    targets: div.querySelectorAll('.letter'),
    duration: 400,
    translateX: -180,
    translateY: -220,
    easing: 'easeOutBack',
    fontSize: '35pt',
    delay: 200,
  });
  const userdiv = animScript(alertData.user);
  staging.appendChild(userdiv);
  anime({
    targets: userdiv.querySelectorAll('.letter'),
    translateX: -150,
    translateY: -160,
    rotate: '1turn',
    duration: 400,
    easing: 'easeOutCubic',
    delay: anime.stagger(50),
  });
  await delay(3000);
  await animate({
    targets: [
      div.querySelectorAll('.letter'),
      userdiv.querySelectorAll('.letter'),
    ],
    duration: 200,
    easing: 'easeOutCubic',
    scaleX: 0.8,
    scaleY: 0,
    rotate: () => `${anime.random(0, 40)}deg`,
    translateX: () => anime.random(-170, -220),
    translateY: () => anime.random(-160, -200),
    delay: anime.stagger(20),
  });
  staging.removeChild(div);
}

async function playAlert(alertData: AlertData) {
  isPlaying = true;
  switch (alertData.type) {
    case 'follow':
      await followAnim(alertData);
      break;
    case 'sub':
      await subAnim(alertData);
      break;
    case 'cheer':
      await cheerAnim(alertData);
      break;
    case 'raid':
      await raidAnim(alertData);
      break;
    case 'redeem-shitpost':
      playShitpost(alertData);
      break;
    default:
    // TODO
  }
  isPlaying = false;
}

// TODO Please just do better
setInterval(async () => {
  if (alertQueue.length > 0 && !isPlaying) {
    await playAlert(alertQueue.shift());
  }
}, 1000);

/*
 * Subscriptions are handled by twitch with multiple events, each of which only
 * contains part of the story (sub info, streak, etc), to make sure we have the
 * full picture, wait a bunch to catch all the events and aggregate their info
 * together
 */
const impendingSubs: Record<string, SubAlert[]> = {};
function deduplicateSubs(name: string) {
  // Deduplicate subs
  const dedup = impendingSubs[name].filter((sub, i, self) => {
    const streak = 'total' in sub ? sub.total : 1;
    const maxStreak = self.reduce(
      (acc, cur) => Math.max(acc, 'total' in cur ? cur.total : 1),
      0
    );
    return streak >= maxStreak;
  });
  impendingSubs[name] = [];
  alertQueue.push(...dedup);
}

async function run() {
  // Connect to strimertul and OBS
  const server = await Kilovolt();
  await initOBS();

  // Start subscription for timer events
  server.subscribeKey('stulbe/ev/webhook', async (newValue) => {
    const ev = JSON.parse(newValue) as EventSubEvent;
    switch (ev.subscription.type) {
      case 'channel.follow':
        alertQueue.push({
          type: 'follow',
          user: (ev as FollowEvent).event.user_name,
        });
        break;
      case 'channel.subscribe': {
        const sub = ev as SubscriptionEvent;
        if (!(sub.event.user_name in impendingSubs)) {
          impendingSubs[sub.event.user_name] = [];
        }
        impendingSubs[sub.event.user_name].push({
          type: 'sub',
          user: sub.event.user_name,
          gift: sub.event.is_gift,
          tier: sub.event.tier,
        });
        setTimeout(deduplicateSubs.bind(this, sub.event.user_name), 5000);
        break;
      }
      case 'channel.subscription.message': {
        const sub = ev as ResubscriptionEvent;
        if (!(sub.event.user_name in impendingSubs)) {
          impendingSubs[sub.event.user_name] = [];
        }
        impendingSubs[sub.event.user_name].push({
          type: 'sub',
          user: sub.event.user_name,
          gift: false,
          tier: sub.event.tier,
          message: sub.event.message,
          total: sub.event.cumulative_months,
          streak: sub.event.streak_months,
        });
        break;
      }
      case 'channel.cheer': {
        const chr = ev as CheerEvent;
        alertQueue.push({
          type: 'cheer',
          user: chr.event.user_name,
          amount: chr.event.bits,
          message: chr.event.message,
        });
        break;
      }
      case 'channel.raid': {
        const chr = ev as RaidEvent;
        alertQueue.push({
          type: 'raid',
          user: chr.event.from_broadcaster_user_name,
          viewers: chr.event.viewers,
        });
        break;
      }
      case 'channel.channel_points_custom_reward_redemption.add': {
        const redeem = ev as CustomRewardRedemptionEvent;
        switch (redeem.event.reward.id) {
          case '66ce0b06-1f39-4742-81c2-962dbf98fb06': // Shitpost time
            alertQueue.push({
              type: 'redeem-shitpost',
              user: redeem.event.user_name,
            });
            break;
        }
      }
    }
  });
}

run();
