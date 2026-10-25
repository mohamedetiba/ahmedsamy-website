import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'seo',
  title: 'السيو (SEO)',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: 'metaTitle', title: 'عنوان جوجل (Meta Title)', type: 'string',
      description: 'اللي بيظهر كعنوان في نتايج جوجل وتاب المتصفح. الأفضل من 30 لـ 60 حرف، وحطي الكلمة المهمة في أوله.',
      validation: (r) => [r.max(60).warning('أطول من 60 حرف، جوجل ممكن يقصه.'), r.min(25).warning('قصير، استغلي المساحة بكلمات بيدور عليها الناس.')],
    }),
    defineField({
      name: 'metaDescription', title: 'وصف جوجل (Meta Description)', type: 'text', rows: 3,
      description: 'الوصف اللي تحت العنوان في نتايج جوجل. من 120 لـ 160 حرف، وينتهي بدعوة واضحة زي "احجزي".',
      validation: (r) => [r.max(160).warning('أطول من 160 حرف، جوجل ممكن يقصه.'), r.min(80).warning('قصير، زودي تفاصيل تقنع الناس تدخل.')],
    }),
    defineField({ name: 'focusKeyword', title: 'الكلمة المستهدفة', type: 'string', description: 'للمتابعة الداخلية بس، مش بتظهر في الموقع. مثال: علاج تأخر الإنجاب في المنصورة' }),
    defineField({ name: 'ogImage', title: 'صورة المشاركة (فيسبوك وواتساب)', type: 'image', description: 'المقاس المثالي 1200×630.', options: { hotspot: true } }),
    defineField({ name: 'noIndex', title: 'إخفاء الصفحة من جوجل', type: 'boolean', initialValue: false }),
  ],
});
