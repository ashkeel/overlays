import Kilovolt from '@strimertul/kilovolt-client';
import {
  CustomRewardRedemptionEvent,
  EventSubEvent,
} from '../lib/twitch-types';
import { Kilovolt as KV } from '../lib/connection-utils';
import { spin } from './wheel';

const main = document.querySelector('main');

const minigames = [
  'Opus Magnum Sigmar Garden',
  'Molek-Syntek Solitaire',
  'Littlewood Tarott Master',
  'Super Auto Pets',
  'Frozen Synapse skirmish',
  'Spin Rhythm XD',
  //'Windjammers 2',
  //'Jazztronauts',
  'No Straight Roads Parry mode',
  'CrossCode Cave of Aspiration',
  'Shenzen I/O Solitaire',
  'Sonic Riders Battle',
  'SRB2Kart SPB Attack',
  'BMS',
  'hackmud tour',
  'Virtual-On',
  'Frozen Cortex skirmish',
  'PSO2 Boss',
  'Sonic GT challenge',
  'Alicia race',
  //'.hack//GU Dungeon',
  'Diabotical Temple escape',
  'OSFE Shopkeeper 1',
  'Celeste C-side',
  'Flesh & Blood vs Bot',
  'Hyper Hexagonest 60sec run',
  'Inertial Drift challenge',
  'SEGA Rally 2',
  'HITMAN contract',
];

const redeemWheel = [
  'Booba mode',
  'Sonic model',
  'Nothing',
  'ASMR',
  'Get on the wall',
  'Spin the other wheel',
  'Make me tweet something',
  'Ash rates you',
  'Ara Ara~',
  'Get scammed',
  'Nya-speak for 10 minutes',
];

let server: Kilovolt;

async function run() {
  // Connect to strimertul and OBS
  server = await KV();

  // Start subscription for twitch events
  server.subscribeKey('twitch/ev/eventsub-event', async (newValue) => {
    const ev = JSON.parse(newValue) as EventSubEvent;
    switch (ev.subscription.type) {
      case 'channel.channel_points_custom_reward_redemption.add':
        const redeem = ev as CustomRewardRedemptionEvent;
        switch (redeem.event.reward.id) {
          case '7136dcc8-f1ec-4f75-93a5-e0da19f0bcff': // Minigame break
            spin(main, 'MINIGAME WHEEL', minigames, (picked) => {
              server.putKey(
                'twitch/@send-chat-message',
                `Minigame break game: ${picked}`
              );
            });
            break;
          case '0f487953-fe97-4477-a41f-5c18c607da89':
            spin(
              main,
              'SUPER WHEEL',
              [...redeemWheel, ...redeemWheel],
              (picked) => {
                server.putKey(
                  'twitch/@send-chat-message',
                  `Super redeem: ${picked}`
                );
              }
            );
            break;
          default:
            console.log(redeem.event.reward.id);
        }
    }
  });
}
run();
