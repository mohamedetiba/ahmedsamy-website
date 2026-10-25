import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes, singletons } from './schemas/index.js';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '029m0vsv';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';
// مسار الرفع (/studio) بيتظبط وقت البناء بـ SANITY_STUDIO_BASEPATH، فمش محتاجين basePath هنا

const single = (S, id, title) => S.listItem().title(title).id(id).child(S.document().schemaType(id).documentId(id).title(title));

export default defineConfig({
  name: 'ahmedsamy',
  title: 'موقع د. أحمد سامي',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) => S.list().title('المحتوى').items([
        single(S, 'homePage', 'الصفحة الرئيسية'),
        single(S, 'siteSettings', 'إعدادات الموقع والسيو العام'),
        S.divider(),
        S.documentTypeListItem('service').title('الخدمات'),
        S.documentTypeListItem('post').title('المقالات'),
        S.documentTypeListItem('clinic').title('العيادات'),
        S.documentTypeListItem('faq').title('الأسئلة الشائعة'),
        S.documentTypeListItem('story').title('حالات النجاح'),
        S.documentTypeListItem('package').title('الباكدجات'),
      ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (t) => t.filter(({ schemaType }) => !singletons.includes(schemaType)),
  },
  document: {
    actions: (input, ctx) => (singletons.includes(ctx.schemaType) ? input.filter(({ action }) => ['publish', 'discardChanges', 'restore'].includes(action)) : input),
  },
});
