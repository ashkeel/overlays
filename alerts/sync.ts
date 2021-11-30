import anime from 'animejs';

// Awaitable setTimeout
export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Awaitable anime()
export async function animate(params: anime.AnimeParams) {
  return new Promise((resolve) =>
    anime({
      ...params,
      complete: params.complete
        ? (anim) => {
            params.complete(anim);
            resolve(anim);
          }
        : resolve,
    })
  );
}
