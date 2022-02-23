const fs = require('fs');
const inlineAssets = require('inline-assets');
const dist = __dirname + '/dist';
const files = fs.readdirSync(dist);
if (!files) {
  console.info('nothing to do');
  return;
}
fs.mkdirSync(`${dist}/inline`);
files
  .filter((f) => f.endsWith('.html'))
  .forEach((f) => {
    const from = `${dist}/${f}`;
    const to = `${dist}/inline/${f}`;
    var content = fs.readFileSync(from, 'utf8');
    content = inlineAssets(to, from, content, {});
    fs.writeFileSync(to, content, 'utf8');
  });
/*

*/
