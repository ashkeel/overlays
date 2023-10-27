import XLRWebSocket, { Patch } from '../lib/xlr';

const statusEl = document.getElementById('status');
function setMuted(muted: boolean) {
  statusEl.classList.toggle('muted', muted);
}

async function run() {
  const xlr = new XLRWebSocket();
  await xlr.connect();
  const status = await xlr.status();

  // Remove error message
  const errEl = document.querySelector('article.error');
  errEl.classList.remove('error');
  errEl.textContent = 'OK';

  const mixers = Object.keys(status.Status.mixers);
  const mixer_name = mixers[0];
  const my_mixer = status.Status.mixers[mixer_name];
  const muted = my_mixer.fader_status.A.mute_state !== 'Unmuted';
  setMuted(muted);

  xlr.on('patch', (change: CustomEvent<Patch>) => {
    change.detail.Patch.forEach((patch) => {
      if (patch.path == `/mixers/${mixer_name}/fader_status/A/mute_state`) {
        setMuted(patch.value !== 'Unmuted');
      }
    });
  });
}
run();
