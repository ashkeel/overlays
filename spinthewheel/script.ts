import {
  type CustomRewardRedemptionEvent,
  Strimertul,
} from '@strimertul/strimertul';
import { Kilovolt as KV } from '../lib/connection-utils';
import { spin } from './wheel';

const main = document.querySelector('main');

const minigames = [
  'Opus Magnum Sigmar Garden',
  'Molek-Syntek Solitaire',
  //'Littlewood Tarott Master',
  'Super Auto Pets',
  'Frozen Synapse skirmish',
  'Spin Rhythm XD',
  'No Straight Roads Parry mode',
  'CrossCode Cave of Aspiration',
  'Shenzen I/O Solitaire',
  'SRB2Kart SPB Attack',
  'BMS',
  'Virtual-On',
  'Frozen Cortex skirmish',
  //'PSO2 Boss',
  'Sonic GT challenge',
  'Alicia race',
  '.hack//GU Dungeon',
  'Diabotical Temple escape',
  'One Step From Eden run',
  'Flesh & Blood vs Bot',
  //'Hyper Hexagonest 60sec run',
  'Inertial Drift challenge',
  'SEGA Rally 2',
  'HITMAN contract',
];

const redeemWheel = [
  'Booba mode',
  'Nothing',
  'Get on the wall',
  'Ara Ara~',
  'Get scammed',
  'Nya-speak for 10 minutes',
  'AD time!',
  'Ash explains',
];

const explainWheel = [
  'Riichi Mahjong',
  'Raymarching',
  'Viewer choice',
  'Ghost cube',
  'Wolfenstein3D Raycasting',
];

async function run() {
  // Connect to strimertul and OBS
  const kv = await KV();
  const strimertul = new Strimertul({ kv });

  // Start subscription for twitch events
  kv.subscribeKey(
    'twitch/ev/eventsub-event/channel.channel_points_custom_reward_redemption.add',
    (newVal) => {
      const redeem = JSON.parse(newVal) as CustomRewardRedemptionEvent;
      switch (redeem.event.reward.id) {
        case '7136dcc8-f1ec-4f75-93a5-e0da19f0bcff': // Minigame break
          spin(main, 'MINIGAME WHEEL', minigames, (picked) => {
            strimertul.twitch.chat.writeMessage(
              `Minigame break game: ${picked}`
            );
          });
          break;
        case '0f487953-fe97-4477-a41f-5c18c607da89': // Super wheel
          spin(
            main,
            'SUPER WHEEL',
            [...redeemWheel, ...redeemWheel],
            (picked) => {
              strimertul.twitch.chat.writeMessage(`Super redeem: ${picked}`);
            }
          );
          break;
      }
    }
  );
}
run();
