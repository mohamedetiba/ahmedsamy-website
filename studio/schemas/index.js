import seo from './seo.js';
import { siteSettings, homePage, service, clinic, faq, story, pkg, post } from './documents.js';
export const schemaTypes = [seo, siteSettings, homePage, service, clinic, faq, story, pkg, post];
export const singletons = ['siteSettings', 'homePage'];
