/* eslint-disable camelcase */

export interface ChannelUpdateEvent {
  subscription: {
    type: 'channel.update';
    created_at: Date;
  };
  event: {
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    title: string;
    language: string;
    category_id: string;
    category_name: string;
    is_mature: boolean;
  };
}

export interface FollowEvent {
  subscription: {
    type: 'channel.follow';
    created_at: Date;
  };
  event: {
    user_id: string;
    user_login: string;
    user_name: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    followed_at: Date;
  };
}

export interface SubscriptionEvent {
  subscription: {
    type: 'channel.subscribe';
    created_at: Date;
  };
  event: {
    user_id: string;
    user_login: string;
    user_name: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    tier: string;
    is_gift: boolean;
  };
}

export interface SubscriptionGiftEvent {
  subscription: {
    type: 'channel.subscription.gift';
    created_at: Date;
  };
  event: {
    user_id?: string;
    user_login?: string;
    user_name?: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    total: number;
    tier: string;
    cumulative_total: number | null;
    is_anonymous: boolean;
  };
}

export interface SubscriptionMessageEmote {
  begin: number;
  end: number;
  id: string;
}

export interface SubscriptionMessage {
  text: string;
  emotes: SubscriptionMessageEmote[];
}

export interface ResubscriptionEvent {
  subscription: {
    type: 'channel.subscription.message';
    created_at: Date;
  };
  event: {
    user_id: string;
    user_login: string;
    user_name: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    tier: string;
    message: SubscriptionMessage;
    cumulative_months: number;
    streak_months: number;
    duration_months: number;
  };
}

export interface CustomRewardRedemptionEvent {
  subscription: {
    type: 'channel.channel_points_custom_reward_redemption.add';
    created_at: Date;
  };
  event: {
    id: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    user_id: string;
    user_login: string;
    user_name: string;
    user_input: string;
    status: string;
    reward: {
      id: string;
      title: string;
      cost: number;
      prompt: string;
    };
    redeemed_at: string;
  };
}

export interface RaidEvent {
  subscription: {
    type: 'channel.raid';
    created_at: Date;
  };
  event: {
    from_broadcaster_user_id: string;
    from_broadcaster_user_login: string;
    from_broadcaster_user_name: string;
    to_broadcaster_user_id: string;
    to_broadcaster_user_login: string;
    to_broadcaster_user_name: string;
    viewers: number;
  };
}

export interface CheerEvent {
  subscription: {
    type: 'channel.cheer';
    created_at: Date;
  };
  event: {
    is_anonymous: boolean;
    user_id?: string;
    user_login?: string;
    user_name?: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    message: string;
    bits: number;
  };
}

export type EventSubEvent =
  | ChannelUpdateEvent
  | FollowEvent
  | SubscriptionEvent
  | SubscriptionGiftEvent
  | ResubscriptionEvent
  | CheerEvent
  | RaidEvent
  | CustomRewardRedemptionEvent;
