/* eslint-disable import/no-unresolved */
/* eslint-disable default-case */
import '../lib/sentry';

import {
  CheerEvent,
  EventSubEvent,
  FollowEvent as TwitchFollowEvent,
  RaidEvent,
  ResubscriptionEvent,
  SubscriptionEvent,
} from '../lib/twitch-types';

import { FollowEvent as GlimeshFollowEvent } from '../lib/glimesh-types';

import { Kilovolt } from '../lib/connection-utils';
import { AlertData, SubAlert } from './types';
import { followAnim, subAnim, cheerAnim, raidAnim } from './animations';

const alertQueue: AlertData[] = [];
let isPlaying = false;

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

  // Start subscription for glimesh events
  server.subscribeKey('glimesh/ev/follow', async (newValue) => {
    const ev = JSON.parse(newValue) as GlimeshFollowEvent;
    alertQueue.push({
      type: 'follow',
      user: ev.user.displayname || ev.user.username,
    });
  });

  // Start subscription for twitch events
  server.subscribeKey('stulbe/ev/webhook', async (newValue) => {
    const ev = JSON.parse(newValue) as EventSubEvent;
    switch (ev.subscription.type) {
      case 'channel.follow':
        alertQueue.push({
          type: 'follow',
          user: (ev as TwitchFollowEvent).event.user_name,
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
    }
  });
}

run();
