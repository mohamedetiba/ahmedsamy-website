# موقع د. أحمد سامي المغازي

الموقع مبني بـ **Astro** ومحتواه بيتدار من **Sanity**، وبيتنشر أوتوماتيك على **GitHub Pages**.

- الموقع: `https://ahmedsamyelmoghazy.com`
- لوحة التحكم (بعد الإعداد): `https://ahmedsamy.sanity.studio`

## بيشتغل إزاي

1. أي حد يعدل في Sanity ويدوس **Publish**.
2. Sanity بيبعت إشارة لـ GitHub (webhook).
3. GitHub Actions بيبني الموقع من جديد وينشره خلال دقيقة أو اتنين.
4. الموقع كمان بيتبني لوحده مرة كل يوم الساعة 4 الفجر احتياطي.

لو Sanity لسه مش متوصل، الموقع بيشتغل عادي بالمحتوى الأساسي الموجود في `src/content/fallback.mjs`.

## الإعداد لأول مرة (مرة واحدة بس)

### 1) Sanity
1. اعمل حساب على [sanity.io](https://www.sanity.io) (ممكن بجوجل).
2. من [sanity.io/manage](https://www.sanity.io/manage) اعمل مشروع جديد باسم `Dr Ahmed Samy`، والـ dataset تبقى `production` و Public.
3. انسخ الـ **Project ID**.
4. من المشروع ← **API** ← **Tokens** اعمل توكنين:
   - `github-deploy` بصلاحية **Deploy Studio**
   - `github-seed` بصلاحية **Editor**

### 2) GitHub (إعدادات الـ repo)
**Settings ← Secrets and variables ← Actions**

| النوع | الاسم | القيمة |
|---|---|---|
| Variable | `SANITY_PROJECT_ID` | الـ Project ID |
| Secret | `SANITY_AUTH_TOKEN` | توكن `github-deploy` |
| Secret | `SANITY_WRITE_TOKEN` | توكن `github-seed` |

**Settings ← Pages ← Source:** اختار **GitHub Actions**.

### 3) نقل المحتوى ورفع لوحة التحكم
من تاب **Actions**:
1. شغّل **Deploy Sanity Studio** (Run workflow) ← لوحة التحكم هتبقى على `ahmedsamy.sanity.studio`.
2. شغّل **Seed Sanity (first time)** ← بيرفع كل المحتوى والصور الحالية جوه Sanity وبيعيد بناء الموقع.

### 4) النشر الأوتوماتيك لما تعمل Publish
1. على GitHub: **Settings (حسابك) ← Developer settings ← Fine-grained tokens ← Generate**، اختار الـ repo ده بس، وصلاحية **Contents: Read and write**.
2. على Sanity: المشروع ← **API ← Webhooks ← Create webhook**:
   - URL: `https://api.github.com/repos/<OWNER>/<REPO>/dispatches`
   - Dataset: `production`، Trigger on: Create, Update, Delete
   - Filter: `!(_id in path("drafts.**"))`
   - Projection: `{"event_type": "sanity-publish"}`
   - HTTP method: `POST`
   - HTTP Headers:
     - `Authorization`: `Bearer <توكن جيت هب>`
     - `Accept`: `application/vnd.github+json`

### 5) الدومين
**Settings ← Pages ← Custom domain:** `ahmedsamyelmoghazy.com` وفعّل **Enforce HTTPS**.

وعند شركة الدومين عدّل الـ DNS:

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | `<OWNER>.github.io` |

امسح أي A record قديم بيشاور على الاستضافة القديمة.

### 6) جوجل
ضيف الموقع في [Google Search Console](https://search.google.com/search-console) وابعت الـ sitemap: `https://ahmedsamyelmoghazy.com/sitemap-index.xml`

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
