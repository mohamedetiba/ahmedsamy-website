import { defineArrayMember, defineField, defineType } from 'sanity';

const slug = (source = 'title') => defineField({
  name: 'slug', title: 'رابط الصفحة (Slug)', type: 'slug',
  description: 'بالإنجليزي وبشرطة بين الكلمات، مثال: ivf-infertility. متغيرهوش بعد النشر علشان الروابط القديمة متبوظش.',
  options: { source, maxLength: 80 }, validation: (r) => r.required(),
});
const order = defineField({ name: 'order', title: 'الترتيب', type: 'number', description: 'الأصغر يظهر الأول.' });
const seo = defineField({ name: 'seo', title: 'السيو', type: 'seo', group: 'seo' });
const body = defineField({
  name: 'body', title: 'المحتوى', type: 'array',
  of: [
    defineArrayMember({ type: 'block', styles: [{ title: 'فقرة', value: 'normal' }, { title: 'عنوان فرعي', value: 'h2' }, { title: 'عنوان أصغر', value: 'h3' }] }),
    defineArrayMember({ type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', title: 'وصف الصورة (مهم للسيو)', type: 'string' })] }),
  ],
});
const groups = [{ name: 'content', title: 'المحتوى', default: true }, { name: 'seo', title: 'السيو' }];
const inContent = (fields) => fields.map((f) => (f.group ? f : { ...f, group: 'content' }));

export const siteSettings = defineType({
  name: 'siteSettings', title: 'إعدادات الموقع', type: 'document', groups,
  fields: inContent([
    defineField({ name: 'doctorName', title: 'اسم الدكتور', type: 'string' }),
    defineField({ name: 'role', title: 'التخصص', type: 'string' }),
    defineField({ name: 'phones', title: 'أرقام الحجز', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'whatsapp', title: 'رقم الواتساب (بالكود الدولي من غير +)', type: 'string', description: 'مثال: 201010603072' }),
    defineField({ name: 'siteUrl', title: 'رابط الموقع', type: 'url' }),
    defineField({ name: 'social', title: 'السوشيال ميديا', type: 'object', fields: ['facebook', 'instagram', 'tiktok', 'youtube'].map((n) => defineField({ name: n, title: n, type: 'url' })) }),
    { ...seo, title: 'السيو الافتراضي للموقع', description: 'بيستخدم لأي صفحة ملهاش سيو خاص بيها.' },
  ]),
  preview: { prepare: () => ({ title: 'إعدادات الموقع' }) },
});

export const homePage = defineType({
  name: 'homePage', title: 'الصفحة الرئيسية', type: 'document', groups,
  fields: inContent([
    defineField({ name: 'kicker', title: 'السطر الصغير فوق العنوان', type: 'string' }),
    defineField({ name: 'titleLine', title: 'العنوان', type: 'string' }),
    defineField({ name: 'titleHighlight', title: 'الكلمة الملونة في العنوان', type: 'string' }),
    defineField({ name: 'lede', title: 'الوصف تحت العنوان', type: 'text', rows: 3 }),
    defineField({ name: 'heroImage', title: 'صورة الواجهة', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'aboutTitle', title: 'عنوان "عن الدكتور"', type: 'string' }),
    defineField({ name: 'aboutText', title: 'نص "عن الدكتور"', type: 'text', rows: 5 }),
    defineField({ name: 'aboutImage', title: 'صورة "عن الدكتور"', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'values', title: 'المميزات', type: 'array', of: [defineArrayMember({ type: 'object', fields: [defineField({ name: 'title', title: 'العنوان', type: 'string' }), defineField({ name: 'text', title: 'النص', type: 'text', rows: 2 })] })] }),
    defineField({ name: 'onlineImage', title: 'صورة الاستشارة الأونلاين', type: 'image', options: { hotspot: true } }),
    seo,
  ]),
  preview: { prepare: () => ({ title: 'الصفحة الرئيسية' }) },
});

export const service = defineType({
  name: 'service', title: 'خدمة', type: 'document', groups,
  fields: inContent([
    defineField({ name: 'title', title: 'اسم الخدمة', type: 'string', validation: (r) => r.required() }),
    slug(), order,
    defineField({ name: 'tag', title: 'وسم صغير', type: 'string', description: 'مثال: أقل تدخل جراحي' }),
    defineField({ name: 'short', title: 'وصف قصير (للكارت)', type: 'text', rows: 3 }),
    defineField({ name: 'points', title: 'نقاط سريعة', type: 'array', of: [{ type: 'string' }] }),
    body,
    defineField({ name: 'image', title: 'صورة الخدمة (اختياري)', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'featured', title: 'الكارت الكبير في الرئيسية', type: 'boolean' }),
    defineField({ name: 'wide', title: 'كارت عريض', type: 'boolean' }),
    seo,
  ]),
  orderings: [{ title: 'الترتيب', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'tag' } },
});

export const clinic = defineType({
  name: 'clinic', title: 'عيادة', type: 'document',
  fields: [
    defineField({ name: 'name', title: 'اسم العيادة', type: 'string', validation: (r) => r.required() }),
    slug('name'), order,
    defineField({ name: 'city', title: 'المدينة', type: 'string' }),
    defineField({ name: 'locality', title: 'المنطقة', type: 'string' }),
    defineField({ name: 'region', title: 'المحافظة', type: 'string' }),
    defineField({ name: 'address', title: 'العنوان', type: 'text', rows: 2 }),
    defineField({ name: 'days', title: 'أيام العمل (عربي)', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'daysEn', title: 'أيام العمل (إنجليزي لجوجل)', type: 'array', of: [{ type: 'string' }], options: { list: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] } }),
    defineField({ name: 'hours', title: 'المواعيد (زي ما تظهر)', type: 'string', description: 'مثال: 2 ظهرًا – 7 مساءً' }),
    defineField({ name: 'opens', title: 'بتفتح (24 ساعة)', type: 'string', description: 'مثال: 14:00' }),
    defineField({ name: 'closes', title: 'بتقفل (24 ساعة)', type: 'string', description: 'مثال: 19:00' }),
    defineField({ name: 'mapUrl', title: 'لينك جوجل مابس', type: 'url' }),
  ],
  preview: { select: { title: 'name', subtitle: 'city' } },
});

export const faq = defineType({
  name: 'faq', title: 'سؤال شائع', type: 'document',
  fields: [defineField({ name: 'q', title: 'السؤال', type: 'string', validation: (r) => r.required() }), defineField({ name: 'a', title: 'الإجابة', type: 'text', rows: 4 }), order],
  preview: { select: { title: 'q' } },
});

export const story = defineType({
  name: 'story', title: 'حالة نجاح', type: 'document',
  fields: [
    defineField({ name: 'title', title: 'العنوان', type: 'string' }),
    defineField({ name: 'type', title: 'النوع', type: 'string', description: 'مثال: حقن مجهري' }),
    defineField({ name: 'badge', title: 'الرقم أو الرمز في الدائرة', type: 'string' }),
    defineField({ name: 'badgeUnit', title: 'الوحدة تحت الرقم', type: 'string', description: 'مثال: سنين' }),
    defineField({ name: 'text', title: 'الحكاية', type: 'text', rows: 4 }),
    order,
  ],
  preview: { select: { title: 'title', subtitle: 'type' } },
});

export const pkg = defineType({
  name: 'package', title: 'باكدج', type: 'document',
  fields: [
    defineField({ name: 'title', title: 'اسم الباكدج', type: 'string' }),
    defineField({ name: 'forWho', title: 'مناسب لمين', type: 'string' }),
    defineField({ name: 'items', title: 'بيشمل', type: 'array', of: [{ type: 'string' }] }),
    order,
  ],
  preview: { select: { title: 'title', subtitle: 'forWho' } },
});

export const post = defineType({
  name: 'post', title: 'مقال', type: 'document', groups,
  fields: inContent([
    defineField({ name: 'title', title: 'العنوان', type: 'string', validation: (r) => r.required() }),
    slug(),
    defineField({ name: 'publishedAt', title: 'تاريخ النشر', type: 'date', initialValue: () => new Date().toISOString().slice(0, 10) }),
    defineField({ name: 'excerpt', title: 'ملخص', type: 'text', rows: 3 }),
    defineField({ name: 'cover', title: 'صورة الغلاف', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'service', title: 'الخدمة المرتبطة', type: 'reference', to: [{ type: 'service' }] }),
    body,
    seo,
  ]),
  orderings: [{ title: 'الأحدث', name: 'date', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'publishedAt' } },
});
