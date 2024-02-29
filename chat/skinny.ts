import '../lib/sentry';
import { Howl } from 'howler';
import { Kilovolt } from '../lib/connection-utils';
import { TwitchEventSubChatMessage, renderTwitchMessage } from './twitch';
import { $el } from '../lib/domutils';

import chatSound from '../assets/sounds/chat-pop.wav';

const mainEl = document.getElementById('chat');
function makeChatMessage(data: TwitchEventSubChatMessage) {
  const color = data.color;
  const username = data.chatter_user_name;
  const message = renderTwitchMessage(data);
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

  kv.subscribeKey('twitch/ev/eventsub-event/channel.chat.message', (newVal) => {
    const data = JSON.parse(newVal);
    makeChatMessage(data.event);
    chatSprite.play();
  });

  (
    await kv.getJSON<{ event: TwitchEventSubChatMessage }[]>(
      'twitch/eventsub-history/channel.chat.message'
    )
  )?.forEach((ev) => makeChatMessage(ev.event));
}

run();
