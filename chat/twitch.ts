export function emoteURL(id: string): string {
  return `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/1.0`;
}

export function renderTwitchMessage(data: TwitchEventSubChatMessage) {
  let message = [];
  for (let fragment of data.message.fragments) {
    switch (fragment.type) {
      case 'mention':
      case 'text':
        message.push(fragment.text);
        break;
      case 'emote':
      case 'cheermote':
        message.push([
          'img',
          {
            className: 'emote',
            src: emoteURL(fragment.emote.id),
          },
        ]);
    }
  }
  return message;
}

export interface TwitchEventSubChatMessage {
  chatter_user_name: string;
  chatter_user_login: string;
  message_id: string;
  message: EventSubChatMessage;
  message_type: EventSubChatMessageType;
  badges: EventSubChatBadge[];
  cheer: EventSubChatMessageCheer;
  color: string;
  reply: EventSubChatMessageReply;
  channel_points_custom_reward_id: string;
}

interface EventSubChatMessage {
  text: string;
  fragments: EventSubChatMessageFragment[];
}

interface EventSubChatMessageReply {
  parent_message_id: string;
  parent_message_body: string;
  parent_user_id: string;
  parent_user_name: string;
  parent_user_login: string;
  thread_message_id: string;
  thread_user_id: string;
  thread_user_name: string;
  thread_user_login: string;
}

interface EventSubChatMessageCheer {
  bits: number;
}

interface EventSubChatBadge {
  set_id: string;
  id: string;
  info: string;
}

type EventSubChatMessageType =
  | 'text'
  | 'channel_points_highlighted'
  | 'channel_points_sub_only'
  | 'user_intro';

type EventSubChatMessageFragmentType =
  | 'text'
  | 'cheermote'
  | 'emote'
  | 'mention';

interface EventSubChatMessageFragment {
  type: EventSubChatMessageFragmentType;
  text: string;
  cheermote: EventSubChatMessageCheermote;
  emote: EventSubChatMessageEmote;
  mention: EventSubChatMessageMention;
}

interface EventSubChatMessageCheermote {
  prefix: string;
  bits: number;
  tier: number;
}

interface EventSubChatMessageEmote {
  id: string;
  emote_set_id: string;
  owner_id: string;
  format: string;
}

interface EventSubChatMessageMention {
  userID: string;
  userName: string;
  userLogin: string;
}
