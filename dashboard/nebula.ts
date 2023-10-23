import { addButton, bad, ok, reallybad, setRow } from './lib';

interface OMEResponse<T> {
  message: 'OK';
  response: T;
  statusCode: 200;
}

interface NebulaStreamStatistics {
  avgThroughputIn: number;
  avgThroughputOut: number;
  connections: StreamConnections;
  createdTime: string;
  lastRecvTime: string;
  lastSentTime: string;
  lastThroughputIn: number;
  lastThroughputOut: number;
  lastUpdatedTime: string;
  maxThroughputIn: number;
  maxThroughputOut: number;
  maxTotalConnectionTime: string;
  maxTotalConnections: number;
  totalBytesIn: number;
  totalBytesOut: number;
  totalConnections: number;
}

export interface PushItem {
  app: string;
  createdTime: string;
  finishTime: string;
  id: string;
  protocol: string;
  sentBytes: number;
  sentTime: number;
  sequence: number;
  startTime: string;
  state: string;
  stream: {
    name: string;
    trackIds: any[];
    variantNames: string[];
  };
  streamKey: string;
  totalsentBytes: number;
  totalsentTime: number;
  url: string;
  vhost: string;
}

interface StreamConnections {
  dash: number;
  file: number;
  hls: number;
  lldash: number;
  llhls: number;
  mpegtspush: number;
  ovt: number;
  rtmppush: number;
  thumbnail: number;
  webrtc: number;
}

const nebulaName = 'Nebula stream';
const button: HTMLButtonElement = addButton('Start simulcast');
button.addEventListener('click', togglePush);

const ome_headers = {
  'Content-Type': 'application/json',
  authorization: `Basic ${import.meta.env.VITE_OME_TOKEN}`,
};

export function initNebulaStream() {
  setRow(nebulaName, 'Loading', { backgroundColor: bad });
  checkNebulaStream();
  checkSimulcast();
  setInterval(checkNebulaStream, 5000);
  setInterval(checkSimulcast, 5000);
}

async function checkNebulaStream() {
  try {
    const response = await fetch(
      'https://stream-api.nebula.cafe/v1/stats/current/vhosts/default/apps/app/streams/stream',
      {
        method: 'GET',
        headers: ome_headers,
      }
    );
    if (response.ok) {
      const data: OMEResponse<NebulaStreamStatistics> = await response.json();
      if (data.message === 'OK') {
        setRow(nebulaName, `${data.response.totalConnections} viewers`, {
          backgroundColor: ok,
        });
      }
    } else {
      if (response.status === 404) {
        setRow(nebulaName, 'Offline', { backgroundColor: bad });
      } else {
        setRow(nebulaName, 'Server error', { backgroundColor: reallybad });
      }
    }
  } catch (error) {
    setRow(nebulaName, 'Server error', { backgroundColor: reallybad });
  }
}

let is_broadcasting = false;
async function checkSimulcast() {
  const response = await fetch(
    'https://stream-api.nebula.cafe/v1/vhosts/default/apps/app:pushes',
    {
      method: 'POST',
      headers: ome_headers,
      body: JSON.stringify({ id: 'twitch-push' }),
    }
  );
  const pushes: OMEResponse<PushItem[]> = await response.json();
  is_broadcasting = pushes.response.length > 0;
  button.innerText = is_broadcasting ? 'STOP simulcast' : 'START simulcast';
}

async function togglePush() {
  if (is_broadcasting) {
    await stopPush();
  } else {
    await startPush();
  }
  checkSimulcast();
}

async function startPush() {
  await fetch(
    'https://stream-api.nebula.cafe/v1/vhosts/default/apps/app:startPush',
    {
      method: 'POST',
      headers: ome_headers,
      body: JSON.stringify({
        id: 'twitch-push',
        stream: {
          name: 'stream',
          variantNames: ['bypass_video', 'bypass_audio'],
        },
        protocol: 'rtmp',
        url: 'rtmp://mil02.contribute.live-video.net/app',
        streamKey: import.meta.env.VITE_TWITCH_STREAMKEY,
      }),
    }
  );
}

async function stopPush() {
  await fetch(
    'https://stream-api.nebula.cafe/v1/vhosts/default/apps/app:stopPush',
    {
      method: 'POST',
      headers: ome_headers,
      body: JSON.stringify({ id: 'twitch-push' }),
    }
  );
}
