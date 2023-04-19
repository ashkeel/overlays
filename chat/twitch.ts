import { TwitchChatMessage, TwitchEmote } from '@strimertul/strimertul';

export function emoteURL(emote: TwitchEmote): string {
  return `https://static-cdn.jtvnw.net/emoticons/v2/${emote.ID}/default/dark/1.0`;
}

export function renderTwitchMessage(data: TwitchChatMessage) {
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
