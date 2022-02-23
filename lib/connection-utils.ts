import KilovoltWS from '@strimertul/kilovolt-client';
import ObsWebSocket from 'obs-websocket-js';

export async function OBS(): Promise<ObsWebSocket> {
  const obs = new ObsWebSocket();
  await obs.connect({
    address: process.env.VITE_OBS_ENDPOINT,
    password: process.env.VITE_OBS_PASSWORD,
  });
  return obs;
}

export async function Kilovolt(): Promise<KilovoltWS> {
  const kv = new KilovoltWS(
    process.env.VITE_KILOVOLT_ENDPOINT,
    process.env.VITE_KILOVOLT_PASSWORD,
    { reconnect: true }
  );
  await kv.wait();
  return kv;
}

export default { OBS, Kilovolt };
