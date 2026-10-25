// بيجيب محتوى الموقع من Sanity وقت البناء.
// لو Sanity مش متوصل (أو نوع محتوى لسه فاضي) بيرجع للمحتوى الأساسي في src/content/fallback.mjs
import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { toHTML } from '@portabletext/to-html';
import * as fb from '../content/fallback.mjs';

// Project ID مش سر، عادي يكون في الكود. لو عايز تشغل الموقع من غير Sanity خالص: PUBLIC_SANITY_PROJECT_ID=none
const envId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID || '029m0vsv';
const projectId = envId === 'none' ? '' : envId;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET || 'production';

export const sanityEnabled = Boolean(projectId);
const client = sanityEnabled
  ? createClient({ projectId, dataset, apiVersion: '2025-01-01', useCdn: false, perspective: 'published' })
  : null;
const builder = sanityEnabled ? createImageUrlBuilder({ projectId, dataset }) : null;

/** صورة من Sanity أو مسار محلي -> رابط */
export function img(source, width = 1200) {
  if (!source) return null;
  if (typeof source === 'string') return source;
  if (!builder || !source.asset) return null;
  return builder.image(source).width(width).auto('format').quality(82).url();
}

export function richText(blocks) {
  if (!blocks || !blocks.length) return '';
  return toHTML(blocks, {
    components: {
      types: {
        image: ({ value }) => {
          const u = img(value, 1200);
          return u ? `<figure><img src="${u}" alt="${(value.alt || '').replace(/"/g, '&quot;')}" loading="lazy"></figure>` : '';
        },
      },
    },
  });
}

const seoFields = `seo{metaTitle, metaDescription, focusKeyword, noIndex, ogImage}`;
const Q = {
  settings: `*[_id=="siteSettings"][0]{doctorName, role, phones, whatsapp, social, siteUrl, ${seoFields}}`,
  home: `*[_id=="homePage"][0]{kicker, titleLine, titleHighlight, lede, heroImage, aboutTitle, aboutText, aboutImage, values, onlineImage, ${seoFields}}`,
  services: `*[_type=="service" && defined(slug.current)]|order(order asc){"slug": slug.current, order, featured, wide, title, tag, short, points, body, image, ${seoFields}}`,
  clinics: `*[_type=="clinic" && defined(slug.current)]|order(order asc){"slug": slug.current, order, city, name, address, region, locality, days, daysEn, hours, opens, closes, mapUrl}`,
  faqs: `*[_type=="faq"]|order(order asc){order, q, a}`,
  stories: `*[_type=="story"]|order(order asc){order, badge, badgeUnit, type, title, text}`,
  packages: `*[_type=="package"]|order(order asc){order, title, forWho, items}`,
  posts: `*[_type=="post" && defined(slug.current)]|order(publishedAt desc){"slug": slug.current, publishedAt, title, excerpt, cover, body, "service": service->slug.current, ${seoFields}}`,
};

let cache;
export async function getData() {
  if (cache) return cache;
  const data = { settings: fb.settings, home: fb.home, services: fb.services, clinics: fb.clinics, faqs: fb.faqs, stories: fb.stories, packages: fb.packages, posts: fb.posts, source: 'fallback' };
  if (client) {
    try {
      const keys = Object.keys(Q);
      const res = await Promise.all(keys.map((k) => client.fetch(Q[k])));
      // لما الإعدادات تكون موجودة في Sanity يبقى المحتوى اتنقل، فالقوائم الفاضية هناك بتفضل فاضية
      const seeded = res[keys.indexOf('settings')] != null;
      keys.forEach((k, i) => {
        const v = res[i];
        if (v == null) return;
        if (Array.isArray(v) && v.length === 0 && !seeded) return;
        if (k === 'settings' || k === 'home') {
          // الحقول الفاضية في Sanity تاخد القيمة الأساسية
          const merged = { ...data[k] };
          for (const [f, val] of Object.entries(v)) if (val != null && val !== '' && !(Array.isArray(val) && !val.length)) merged[f] = val;
          merged.seo = { ...(data[k].seo || {}), ...Object.fromEntries(Object.entries(v.seo || {}).filter(([, x]) => x != null && x !== '')) };
          data[k] = merged;
        } else data[k] = v;
      });
      data.source = 'sanity';
    } catch (e) {
      console.warn('[sanity] fetch failed, using fallback content:', e.message);
    }
  }
  cache = data;
  return data;
}
