const fs = require("node:fs");
const inlineAssets = require("inline-assets");
const dist = `${__dirname}/dist`;
const files = fs.readdirSync(dist);
if (!files) {
	console.info("nothing to do");
	process.exit(0);
}
fs.mkdirSync(`${dist}/inline`);
const html = files.filter((f) => f.endsWith(".html"));
for (const f of html) {
	const from = `${dist}/${f}`;
	const to = `${dist}/inline/${f}`;
	let content = fs.readFileSync(from, "utf8");
	content = inlineAssets(to, from, content, {});
	fs.writeFileSync(to, content, "utf8");
}
