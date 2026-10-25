// بيرفع المحتوى الحالي للموقع جوه Sanity أول مرة.
// بيتشغل من GitHub Actions (Seed Sanity) أو محليًا:
//   SANITY_PROJECT_ID=xxx SANITY_WRITE_TOKEN=xxx node scripts/seed.mjs
// افتراضيًا مش بيكتب فوق أي حاجة موجودة. استخدم --force علشان يستبدل.
import { createClient } from '@sanity/client';
import { readFile } from 'node:fs/promises';
import * as fb from '../src/content/fallback.mjs';

const projectId = process.env.SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;
const force = process.argv.includes('--force');
if (!projectId || !token) {
  console.error('محتاج SANITY_PROJECT_ID و SANITY_WRITE_TOKEN');
  process.exit(1);
}
const client = createClient({ projectId, dataset, token, apiVersion: '2025-01-01', useCdn: false });

const uploaded = {};
async function image(path) {
  if (!path) return undefined;
  if (!uploaded[path]) {
    const buf = await readFile(new URL('../public' + path, import.meta.url));
    const asset = await client.assets.upload('image', buf, { filename: path.split('/').pop() });
    uploaded[path] = asset._id;
    console.log('صورة اترفعت:', path);
  }
  return { _type: 'image', asset: { _type: 'reference', _ref: uploaded[path] } };
}
const slug = (s) => ({ _type: 'slug', current: s });
const keyed = (arr) => (arr || []).map((v, i) => ({ _key: `i${i}`, ...v }));

const docs = [];
docs.push({ _id: 'siteSettings', _type: 'siteSettings', doctorName: fb.settings.doctorName, role: fb.settings.role, phones: fb.settings.phones, whatsapp: fb.settings.whatsapp, siteUrl: fb.settings.siteUrl, social: fb.settings.social,
  seo: { _type: 'seo', metaTitle: fb.settings.seo.metaTitle, metaDescription: fb.settings.seo.metaDescription, ogImage: await image(fb.settings.seo.ogImage) } });
docs.push({ _id: 'homePage', _type: 'homePage', kicker: fb.home.kicker, titleLine: fb.home.titleLine, titleHighlight: fb.home.titleHighlight, lede: fb.home.lede,
  heroImage: await image(fb.home.heroImage), aboutTitle: fb.home.aboutTitle, aboutText: fb.home.aboutText, aboutImage: await image(fb.home.aboutImage),
  values: keyed(fb.home.values), onlineImage: await image(fb.home.onlineImage) });
for (const s of fb.services) docs.push({ _id: `service-${s.slug}`, _type: 'service', title: s.title, slug: slug(s.slug), order: s.order, tag: s.tag, short: s.short, points: s.points, body: s.body, featured: !!s.featured, wide: !!s.wide, seo: { _type: 'seo', ...s.seo } });
for (const c of fb.clinics) { const { slug: sl, ...rest } = c; docs.push({ _id: `clinic-${sl}`, _type: 'clinic', slug: slug(sl), ...rest }); }
fb.faqs.forEach((f, i) => docs.push({ _id: `faq-${i + 1}`, _type: 'faq', ...f }));
fb.stories.forEach((s, i) => docs.push({ _id: `story-${i + 1}`, _type: 'story', ...s }));
fb.packages.forEach((p, i) => docs.push({ _id: `package-${i + 1}`, _type: 'package', ...p }));
for (const p of fb.posts) docs.push({ _id: `post-${p.slug}`, _type: 'post', title: p.title, slug: slug(p.slug), publishedAt: p.publishedAt, excerpt: p.excerpt, body: p.body,
  service: p.service ? { _type: 'reference', _ref: `service-${p.service}` } : undefined, seo: { _type: 'seo', ...p.seo } });

const tx = client.transaction();
for (const d of docs) force ? tx.createOrReplace(d) : tx.createIfNotExists(d);
await tx.commit();
console.log(`تم: ${docs.length} عنصر ${force ? '(استبدال)' : '(الموجود اتساب زي ما هو)'}`);
