import '../lib/sentry';
import { Howl } from 'howler';
import { Kilovolt } from '../lib/connection-utils';
import chatSound from '../assets/sounds/chat-pop.wav';
import { renderTwitchMessage } from './twitch';
import { GlimeshChatMessage } from './glimesh';
import { $el } from '../lib/domutils';
import { colorNick } from './utils';
import { Strimertul, TwitchChatMessage } from '@strimertul/strimertul';

const mainEl = document.getElementById('chat');
function makeChatMessage(data: TwitchChatMessage | GlimeshChatMessage) {
  const color =
    'Tags' in data ? data.Tags.color : colorNick(data.user.username);
  const username = 'user' in data ? data.user.username : data.User.DisplayName;
  const message =
    'Message' in data ? renderTwitchMessage(data) : [data.message];
  const msg = $el('div', { className: 'messagebox' }, [
    'div',
    { className: 'messagecontent' },
    ['div', { className: 'badges' }],
    [
      'div',
      {
        className: 'username',
        style: `color: ${color}`,
      },
      username,
    ],
    ['div', { className: 'message' }, ...message],
  ]);
  mainEl.appendChild(msg);
  while (mainEl.childElementCount > 20) {
    mainEl.removeChild(mainEl.firstChild);
  }
}

const chatSprite = new Howl({ src: [chatSound] });

async function run() {
  // Connect to server
  const kv = await Kilovolt();
  const strimertul = new Strimertul({ kv });

  strimertul.twitch.chat.onMessage((message) => {
    makeChatMessage(message);
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
