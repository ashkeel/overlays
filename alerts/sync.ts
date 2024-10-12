import anime from "animejs";

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
		}),
	);
}
