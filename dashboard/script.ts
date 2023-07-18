import { Kilovolt } from '../lib/connection-utils';

const table = document.getElementById('statuses');
const rows: Record<
  string,
  {
    tr: HTMLTableRowElement;
    nameEl: HTMLTableCellElement;
    statusEl: HTMLTableCellElement;
  }
> = {};
function setRow(
  name: string,
  status: string,
  style: Partial<CSSStyleDeclaration>
) {
  if (!(name in rows)) {
    // Create elements
    const tr = document.createElement('tr');
    const nameEl = document.createElement('th');
    const statusEl = document.createElement('td');
    // Set hierarchy
    tr.appendChild(nameEl);
    tr.appendChild(statusEl);
    table.appendChild(tr);
    // Add text to name element
    nameEl.appendChild(document.createTextNode(name));
    // Add to row dictionary
    rows[name] = { tr, nameEl, statusEl };
  }
  // Set status
  rows[name].statusEl.innerHTML = status;
  // Set styling
  for (const key in style) {
    rows[name].tr.style[key] = style[key];
    rows[name].nameEl.style[key] = style[key];
    rows[name].statusEl.style[key] = style[key];
  }
}

const ok = '#2f6b48';
const bad = '#77302e';
const reallybad = '#ec3c45';
const meh = '#72673c';

const stulName = 'strimertul';
const twitchName = 'Twitch stream';
const preroll = 'Preroll ads';

let username = '';
let adRun = false;
let twitchLive = false;

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

async function run() {
  // Connect to strimertul and OBS
  connectKV();
  setRow(stulName, 'Offline', { backgroundColor: reallybad });
  setRow(twitchName, 'Offline', { backgroundColor: bad });
  setRow(preroll, 'Not live', { backgroundColor: bad });
}

run();
