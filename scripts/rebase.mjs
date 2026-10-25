// لو الموقع شغال على رابط github.io/اسم-الريبو (قبل ربط الدومين)، بيضيف المسار ده لكل الروابط الداخلية.
// بعد ربط الدومين BASE_PATH بيبقى فاضي والسكريبت مش بيعمل حاجة.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const base = (process.env.BASE_PATH || '').replace(/\/$/, '');
if (!base) process.exit(0);
async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (p.endsWith('.html')) yield p;
  }
}
let n = 0;
for await (const f of walk('dist')) {
  const s = await readFile(f, 'utf8');
  const out = s.replace(/(\s(?:href|src|action)=")\/(?!\/)/g, `$1${base}/`);
  if (out !== s) { await writeFile(f, out); n++; }
}
console.log(`rebase: ${n} files -> ${base}`);
