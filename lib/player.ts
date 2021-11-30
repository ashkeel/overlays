async function waitForPlayer(): Promise<void> {
  return new Promise((resolve) => {
    if (window.playerReady) {
      resolve();
    }

    const pollYoutube = setInterval(() => {
      if (window.playerReady) {
        clearInterval(pollYoutube);
        resolve();
      }
    }, 1000);
  });
}

export interface PlayerOptions {
  width?: number;
  height?: number;
  shuffle?: boolean;
  loop?: boolean;
  onStateChange?: (event: YT.OnStateChangeEvent) => void;
}

export async function createPlayer(
  playlistID: string,
  options: PlayerOptions = {},
): Promise<YT.Player> {
  await waitForPlayer();
  return new Promise((resolve) => {
    // Check if it's a video or playlist
    const isPlaylist = playlistID.length > 30;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const playerclass = new YT.Player('player', {
      height: options.height || '400',
      width: options.width || '720',
      events: {
        onReady: (event) => {
          const player = event.target as YT.Player;
          setTimeout(() => {
            player.setVolume(100);
            if (isPlaylist) {
              player.setShuffle(
                typeof options.shuffle !== 'undefined' ? options.shuffle : true,
              );
              player.setLoop(
                typeof options.loop !== 'undefined' ? options.loop : true,
              );
              player.playVideoAt(0);
            } else {
              player.playVideo();
            }
            resolve(player);
          }, 1000);
        },
        onStateChange: (ev) => {
          if (options.onStateChange) {
            options.onStateChange(ev);
          }
        },
      },
      playerVars: {
        list: isPlaylist ? playlistID : undefined,
        controls: 0,
        modestbranding: 1,
        enablejsapi: 1,
        showinfo: 0,
      },
      videoId: isPlaylist ? undefined : playlistID,
    });
  });
}

export default { createPlayer };
