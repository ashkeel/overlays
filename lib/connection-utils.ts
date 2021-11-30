import KilovoltWS from '@strimertul/kilovolt-client';
import ObsWebSocket from 'obs-websocket-js';

export async function OBS(): Promise<ObsWebSocket> {
  const obs = new ObsWebSocket();
  await obs.connect({
    address: import.meta.env.VITE_OBS_ENDPOINT,
    password: import.meta.env.VITE_OBS_PASSWORD,
  });
  return obs;
}

export async function Kilovolt(): Promise<KilovoltWS> {
  const kv = new KilovoltWS(
    import.meta.env.VITE_KILOVOLT_ENDPOINT,
    import.meta.env.VITE_KILOVOLT_PASSWORD
  );
  await kv.wait();
  return kv;
}

export default { OBS, Kilovolt };
