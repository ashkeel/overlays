const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
const scriptTag = document.getElementsByTagName('script')[0];
scriptTag.parentNode.insertBefore(tag, scriptTag);

window.playerReady = false;
// @ts-expect-error I can't be bothered to add types
window.onYouTubeIframeAPIReady = () => {
  console.info('YT player ready');
  window.playerReady = true;
};
