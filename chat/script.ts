import '../lib/sentry';
import { Howl } from 'howler';
import { Kilovolt } from '../lib/connection-utils';
//@ts-expect-error asset
import chatSound from 'url:../assets/sounds/chat-pop.wav';
import { makeTwitchChatMessage, TwitchPrivMsg } from './twitch';
import { GlimeshChatMessage, makeGlimeshChatMessage } from './glimesh';

const chatSprite = new Howl({ src: [chatSound] });

async function run() {
  // Connect to server
  const kv = await Kilovolt();

  kv.subscribeKey('twitch/ev/chat-message', (newVal) => {
    makeTwitchChatMessage(JSON.parse(newVal));
    chatSprite.play();
  });

  kv.subscribeKey('glimesh/ev/chat-message', (newVal) => {
    makeGlimeshChatMessage(JSON.parse(newVal));
    chatSprite.play();
  });

  (await kv.getJSON<TwitchPrivMsg[]>('twitch/chat-history'))?.forEach(
    makeTwitchChatMessage
  );
  (await kv.getJSON<GlimeshChatMessage[]>('glimesh/chat-history'))?.forEach(
    makeGlimeshChatMessage
  );
}

run();
