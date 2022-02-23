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

const stulName = 'strimertul';
const twitchName = 'Twitch stream';

async function connectKV() {
  const server = await Kilovolt();
  setRow(stulName, 'OK', { backgroundColor: ok });
  server.subscribeKey('twitch/stream-info', (newValue) => {
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
      setRow(twitchName, 'LIVE', { backgroundColor: ok });
    } else {
      setRow(twitchName, 'Offline', { backgroundColor: bad });
    }
  });
  server.on('stateChange', (ev) => {
    switch (ev.data) {
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
        console.log('unknown status ' + ev.data);
    }
  });
}

async function run() {
  // Connect to strimertul and OBS
  connectKV();
  setRow(stulName, 'Offline', { backgroundColor: reallybad });
  setRow(twitchName, 'Offline', { backgroundColor: bad });
}

run();
