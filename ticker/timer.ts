const timer = document.querySelector('#timer span');

// Calculate target time (time until next 2PM)
const target = new Date();
if (target.getHours() >= 14) {
  target.setDate(target.getDate() + 1);
}
target.setSeconds(0);
target.setMinutes(0);
target.setHours(14);

const twittercom = { status: 1515976417787494401, photo: 1 };

setInterval(() => {
  // Get current time
  const now = new Date();

  // Calculate time difference
  const diff = Math.abs(target.getTime() - now.getTime()) / 1000;

  // Create string in HH:MM:SS format
  const hours = Math.floor(diff / 3600);
  const minutes = Math.trunc((diff % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.trunc(diff % 60)
    .toString()
    .padStart(2, '0');

  // Display time with leading zeros
  timer.textContent = `${hours}:${minutes}:${seconds}`;
}, 1000);
