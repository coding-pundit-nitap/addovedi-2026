import fs from 'fs';
import pkg from 'pdfjs-dist/legacy/build/pdf.js'; const pdfjs = pkg;
const data = new Uint8Array(fs.readFileSync(process.argv[2]));
const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
console.log('pages', doc.numPages);
for (let i = 1; i <= doc.numPages; i++) {
  const page = await doc.getPage(i);
  const tc = await page.getTextContent();
  let line = '', lastY = null, out = [];
  for (const it of tc.items) {
    const y = Math.round(it.transform[5]);
    if (lastY !== null && Math.abs(y - lastY) > 3) { out.push(line); line = ''; }
    line += it.str; lastY = y;
  }
  out.push(line);
  console.log(`\n--- PAGE ${i} ---\n` + out.join('\n'));
}
