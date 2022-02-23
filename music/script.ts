import '../lib/sentry';

const musicEl = document.getElementById('music');
const artistEl = document.getElementById('artist');
const titleEl = document.getElementById('title');

async function run() {
  setInterval(async () => {
    const req = await fetch('http://localhost:1608');
    const data = await req.json();
    console.log(data);
    if (data.status === 'playing') {
      musicEl.classList.add('playing');
      artistEl.innerHTML = data.artists[0];
      titleEl.innerHTML = data.title;
    } else {
      musicEl.classList.remove('playing');
    }
  }, 1000);
}
run();
