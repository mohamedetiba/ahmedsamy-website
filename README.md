# موقع د. أحمد سامي المغازي

الموقع مبني بـ **Astro** ومحتواه بيتدار من **Sanity**، وبيتنشر أوتوماتيك على **GitHub Pages**.

- الموقع: `https://ahmedsamyelmoghazy.com`
- لوحة التحكم: `https://ahmedsamyelmoghazy.com/studio/` (ادخل بحساب Sanity)

## بيشتغل إزاي

1. أي حد يعدل في Sanity ويدوس **Publish**.
2. Sanity بيبعت إشارة لـ GitHub (webhook).
3. GitHub Actions بيبني الموقع من جديد وينشره خلال دقيقة أو اتنين.
4. الموقع كمان بيتبني لوحده مرة كل يوم الساعة 4 الفجر احتياطي.

لو Sanity لسه مش متوصل، الموقع بيشتغل عادي بالمحتوى الأساسي الموجود في `src/content/fallback.mjs`.

## الإعداد (اللي اتعمل واللي فاضل)

**اتعمل:**
- مشروع Sanity باسم `Dr Ahmed Samy` (Project ID: `029m0vsv`، dataset: `production`).
- كل المحتوى الحالي اتنقل جوه Sanity واتنشر.
- لوحة التحكم بتترفع مع الموقع نفسه على `/studio/` (مفيش أي توكن محتاج يتحط في GitHub).
- CORS للدومين ولـ github.io.

**فاضل:**
1. **GitHub Pages:** Settings ← Pages ← Source: **GitHub Actions**.
2. **الدومين:** Settings ← Pages ← Custom domain: `ahmedsamyelmoghazy.com` وفعّل Enforce HTTPS، وعدّل الـ DNS:

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | `mohamedetiba.github.io` |

3. **نشر أوتوماتيك لما تعمل Publish (اختياري، من غيره الموقع بيتحدث مرة كل يوم):**
   - GitHub: Settings (حسابك) ← Developer settings ← Fine-grained tokens ← اختار الـ repo ده بس وصلاحية **Contents: Read and write**.
   - Sanity: [sanity.io/manage](https://www.sanity.io/manage) ← Dr Ahmed Samy ← API ← Webhooks ← Create:
     - URL: `https://api.github.com/repos/mohamedetiba/ahmedsamy-website/dispatches`
     - Trigger on: Create, Update, Delete — Filter: `!(_id in path("drafts.**"))`
     - Projection: `{"event_type": "sanity-publish"}` — Method: `POST`
     - Headers: `Authorization: Bearer <توكن جيت هب>` و `Accept: application/vnd.github+json`
   - أو من غير webhook: تاب Actions ← Deploy site ← Run workflow.

4. **جوجل:** Google Search Console ← ابعت `https://ahmedsamyelmoghazy.com/sitemap-index.xml`

## إدارة السيو من Sanity

كل خدمة ومقال فيها تاب **السيو** فيه:
- **عنوان جوجل**: من 30 لـ 60 حرف، والكلمة المهمة في الأول.
- **وصف جوجل**: من 120 لـ 160 حرف، وينتهي بدعوة زي "احجزي".
- **الكلمة المستهدفة**: للمتابعة بس.
- **صورة المشاركة**: 1200×630.
- **إخفاء من جوجل**: للصفحات اللي مش عايزها تظهر.

Sanity بيحذرك لو العنوان أو الوصف أطول أو أقصر من المناسب.

الموقع بيطلع لوحده: sitemap، روابط canonical، Open Graph، وبيانات منظمة (Schema) للدكتور والعيادات والأسئلة الشائعة والمقالات ومسار الصفحة.

## للمطورين

```bash
npm ci
npm run dev       # محتاج Node 22.23+ أو 24
PUBLIC_SANITY_PROJECT_ID=xxx npm run build

cd studio && npm ci
SANITY_STUDIO_PROJECT_ID=xxx npm run dev
```
