import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox'] });
for (const n of ['robo-soccer','dune-dominator']) {
  const p = await b.newPage();
  await p.goto('file://' + process.argv[2] + '/' + n + '.html', { waitUntil: 'load' });
  await p.pdf({ path: process.argv[3] + '/Addovedi-2026-' + n + '-rulebook.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true });
  await p.close();
}
await b.close();
