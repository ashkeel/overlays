function hslToRgb(h: number, s: number, l: number) {
	if (s === 0) {
		const grey = l * 255;
		return [grey, grey, grey];
	}

	function hue2rgb(p: number, q: number, tI: number) {
		let t = tI;
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	}
	const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	const p = 2 * l - q;
	const r = hue2rgb(p, q, h + 1 / 3) * 255;
	const g = hue2rgb(p, q, h) * 255;
	const b = hue2rgb(p, q, h - 1 / 3) * 255;
	return [r, g, b];
}

export function colorNick(nick: string) {
	const sum = nick.split("").reduce((acc, c, idx) => acc + c.charCodeAt(0), 0);
	const ordVal = (sum + 300) % 256;
	const lumC = (sum + 631) % 100;
	const cVals = hslToRgb(ordVal / 256, 0.9, 0.2 + lumC / 500);
	return `#${cVals
		.map((x) => Math.floor(x).toString(16).padStart(2, "0"))
		.join("")}`;
}
