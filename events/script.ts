import { Kilovolt, OBS } from '../lib/connection-utils';
import { delay } from '../lib/sync';
import {
  EventSubEvent,
  CustomRewardRedemptionEvent,
} from 'lib/twitch-types.ts';
import ObsWebSocket from 'obs-websocket-js';

let obs: ObsWebSocket = null;
const alertSceneName = 'TRIPPIN';

async function trippy() {
  await obs.send('SetMute', { source: 'BGM', mute: true });
  const scene = await obs.send('GetCurrentScene');

  await obs.send('SetSceneTransitionOverride', {
    sceneName: alertSceneName,
    transitionName: 'Cut',
    transitionDuration: 50,
  });
  await obs.send('SetSourceSettings', {
    sourceName: 'Source Mirror',
    sourceSettings: {
      'Source.Mirror.Source': scene.name,
    },
  });

  await obs.send('SetCurrentScene', { 'scene-name': alertSceneName });

  await delay(30000);

  await obs.send('SetSceneTransitionOverride', {
    sceneName: scene.name,
    transitionName: 'Cut',
    transitionDuration: 50,
  });
  await obs.send('SetCurrentScene', { 'scene-name': scene.name });
  await obs.send('SetMute', { source: 'BGM', mute: false });
}

async function run() {
  obs = await OBS();

  // Connect to strimertul and OBS
  const server = await Kilovolt();

  // Start subscription for twitch events
  server.subscribeKey('stulbe/ev/webhook', async (newValue) => {
    const ev = JSON.parse(newValue) as EventSubEvent;
    switch (ev.subscription.type) {
      case 'channel.channel_points_custom_reward_redemption.add': {
        const redeem = ev as CustomRewardRedemptionEvent;
        switch (redeem.event.reward.id) {
          case '4d48b337-997e-47be-a50c-c3c9c8c102f9': // Eat funny pill
            trippy();
            break;
        }
      }
    }
  });
}

run();
