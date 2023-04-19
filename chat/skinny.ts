import '../lib/sentry';
import { Howl } from 'howler';
import { TwitchChatMessage } from '@strimertul/strimertul';
import { Kilovolt } from '../lib/connection-utils';
import { renderTwitchMessage } from './twitch';
import { GlimeshChatMessage } from './glimesh';
import { $el } from '../lib/domutils';
import { colorNick } from './utils';

//@ts-expect-error asset
import chatSound from 'url:../assets/sounds/chat-pop.wav';

const mainEl = document.getElementById('chat');
function makeChatMessage(data: TwitchChatMessage | GlimeshChatMessage) {
  const color =
    'Tags' in data ? data.Tags.color : colorNick(data.user.username);
  const username = 'user' in data ? data.user.username : data.User.DisplayName;
  const message =
    'Message' in data ? renderTwitchMessage(data) : [data.message];
  const msg = $el('div', { className: 'messagebox' }, [
    'div',
    { className: 'messagecontent', style: `box-shadow: 2px -2px 0 ${color}` },
    ['div', { className: 'badges' }],
    [
      'div',
      {
        className: 'username',
        style: `color: ${color}`,
      },
      ['div', { className: 'pin', style: `background: ${color}` }],
      username,
    ],
    ['div', { className: 'message' }, ...message],
  ]);
  mainEl.appendChild(msg);
  while (mainEl.childElementCount > 10) {
    mainEl.removeChild(mainEl.firstChild);
  }
}

const chatSprite = new Howl({ src: [chatSound] });

async function run() {
  // Connect to server
  const kv = await Kilovolt();

  kv.subscribeKey('twitch/ev/chat-message', (newVal) => {
    makeChatMessage(JSON.parse(newVal));
    chatSprite.play();
  });

  kv.subscribeKey('glimesh/ev/chat-message', (newVal) => {
    makeChatMessage(JSON.parse(newVal));
    chatSprite.play();
  });

  (await kv.getJSON<TwitchChatMessage[]>('twitch/chat-history'))?.forEach(
    makeChatMessage
  );
  /*
  (await kv.getJSON<GlimeshChatMessage[]>('glimesh/chat-history'))?.forEach(
    makeChatMessage
  );
  */
}

run();
