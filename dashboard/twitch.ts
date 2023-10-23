import { Kilovolt } from '../lib/connection-utils';
import { bad, meh, ok, reallybad, setRow } from './lib';

const stulName = 'strimertul';

let username = '';
let twitchLive = false;
let adRun = false;

const twitchName = 'Twitch stream';
const preroll = 'Preroll ads';

export function initTwitch() {
  setRow(stulName, 'Offline', { backgroundColor: reallybad });
  setRow(twitchName, 'Offline', { backgroundColor: bad });
  setRow(preroll, 'Not live', { backgroundColor: bad });

  // Connect to strimertul and OBS
  connectKV();
}

async function connectKV() {
  const server = await Kilovolt();
  setRow(stulName, 'OK', { backgroundColor: ok });
  const updateStatus = function (newValue) {
    const val = JSON.parse(newValue) as {
      id: string;
      user_name: string;
      user_login: string;
      game_name: string;
      title: string;
      viewer_count: number;
      started_at: string;
      language: string;
      thumbnail_url: string;
    }[];

    if (val.length > 0) {
      setRow(twitchName, `LIVE - ${val[0].user_name}`, { backgroundColor: ok });
      username = val[0].user_login;
      twitchLive = true;
      checkPreroll();
    } else {
      setRow(twitchName, 'Offline', { backgroundColor: bad });
      twitchLive = false;
    }
  };
  server.getKey('twitch/stream-info').then(updateStatus);
  server.subscribeKey('twitch/stream-info', updateStatus);
  server.on('stateChange', (ev) => {
    // TODO fix this!!!
    const event = ev as unknown as { data: number };
    switch (event.data) {
      case WebSocket.CONNECTING:
        setRow(stulName, 'Connecting...', {});
        break;
      case WebSocket.OPEN:
        setRow(stulName, 'OK', { backgroundColor: ok });
        break;
      case WebSocket.CLOSED:
        setRow(stulName, 'Offline', { backgroundColor: reallybad });
        break;
      default:
        console.log('unknown status ' + event.data);
    }
  });
}

interface PrerollData {
  data: {
    user: {
      prerollFreeTimeSeconds: number;
    };
  };
  extensions: {
    durationMilliseconds: number;
    requestID: string;
  };
}

async function checkPreroll() {
  if (!twitchLive || !username) {
    setRow(twitchName, 'Not live', { backgroundColor: bad });
    return;
  }
  console.log('Checking for ' + username);
  // Check preroll time
  try {
    const res = await fetch('https://gql.twitch.tv/gql', {
      headers: {
        'Client-Id': import.meta.env.VITE_TWITCH_TOKEN,
        'Content-Type': 'application/json',
      },
      body:
        '{"query":"query { user(login: \\"' +
        username +
        '\\") {prerollFreeTimeSeconds}}"}',
      method: 'POST',
      mode: 'cors',
    });
    if (!res.ok) {
      const err = (await res.json()).message ?? res.statusText;
      setRow(preroll, 'ERROR: ' + err, { backgroundColor: reallybad });
      return;
    }
    const data = (await res.json()) as PrerollData;
    const seconds = data.data.user.prerollFreeTimeSeconds;
    if (seconds > 0) {
      setRow(preroll, 'Disabled!', { backgroundColor: ok });
      adRun = true;
    } else {
      if (adRun) {
        setRow(preroll, "They're back ╯︿╰!", { backgroundColor: meh });
      } else {
        setRow(preroll, 'Run the ad you dummy!!', { backgroundColor: bad });
      }
    }
  } catch (e) {
    setRow(preroll, 'ERROR', { backgroundColor: reallybad });
  }
}
