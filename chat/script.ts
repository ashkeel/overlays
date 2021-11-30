import '../lib/sentry';
import { $el } from '../lib/domutils';
import { Kilovolt } from '../lib/connection-utils';

export interface User {
  ID: string;
  Name: string;
  DisplayName: string;
  Color: string;
  Badges: Record<string, number>;
}

export interface Emote {
  Name: string;
  ID: string;
  Count: number;
}

export interface PrivMsg {
  User: User;
  Raw: string;
  Type: number;
  RawType: string;
  Tags: Record<string, string>;
  Message: string;
  Channel: string;
  RoomID: string;
  ID: string;
  Time: Date;
  Emotes: Emote[];
  Bits: number;
  Action: boolean;
}

const mainEl = document.getElementById('chat');

function emoteURL(emote: Emote): string {
  return `https://static-cdn.jtvnw.net/emoticons/v2/${emote.ID}/default/dark/1.0`;
}

function renderMessage(data: PrivMsg) {
  let message = [data.Message];
  if (data.Emotes) {
    data.Emotes.forEach((emote) => {
      message = message.flatMap((fragment) => {
        // This fragment is already an emote, ignore it
        if (Array.isArray(fragment)) {
          return [fragment];
        }
        // Search first instance of emote
        let msg = fragment;
        let pos = msg.indexOf(emote.Name);
        if (pos < 0) {
          // Not found, return as is
          return [fragment];
        }
        // Start inserting emote in any instance
        const processed = [];
        const emoteurl = emoteURL(emote);
        let maxEmotes = 0;
        while (pos >= 0 && maxEmotes < 20) {
          if (pos > 0) {
            processed.push(msg.substr(0, pos));
          }
          msg = msg.substr(pos + emote.Name.length);
          processed.push([
            'img',
            {
              className: 'emote',
              src: emoteurl,
            },
          ]);
          pos = msg.indexOf(emote.Name);
          maxEmotes += 1;
        }
        processed.push(msg);
        return processed;
      });
    });
  }
  return message;
}

function makeChatMessage(data: PrivMsg) {
  const msg = $el('div', { className: 'messagebox' }, [
    'div',
    { className: 'messagecontent' },
    ['div', { className: 'badges' }],
    [
      'div',
      { className: 'username', style: `color: ${data.Tags.color}` },
      data.User.DisplayName,
    ],
    ['div', { className: 'message' }, ...renderMessage(data)],
  ]);
  mainEl.appendChild(msg);
  while (mainEl.childElementCount > 20) {
    mainEl.removeChild(mainEl.firstChild);
  }
}

async function run() {
  // Connect to server
  const kv = await Kilovolt();

  kv.subscribeKey('twitch/ev/chat-message', (newVal) => {
    makeChatMessage(JSON.parse(newVal));
  });

  const messages: PrivMsg[] = await kv.getJSON('twitch/chat-history');
  if (messages) {
    messages.forEach(makeChatMessage);
  }
}

run();
