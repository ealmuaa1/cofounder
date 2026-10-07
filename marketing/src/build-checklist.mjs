// Renders checklist.html to ../Partnership-Agreement-Checklist.pdf (plus PNG previews).
import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const here = dirname(fileURLToPath(import.meta.url));

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(() => chromium.launch());
const page = await browser.newPage({ viewport: { width: 816, height: 1056 } });
await page.goto('file://' + join(here, 'checklist.html'), { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: join(here, '..', 'Partnership-Agreement-Checklist.pdf'), format: 'Letter', printBackground: true, preferCSSPageSize: true });
const pages = await page.$$('.page');
for (let i = 0; i < pages.length; i++) await pages[i].screenshot({ path: join(here, '..', 'images', `checklist-page${i + 1}.png`) });
await browser.close();
console.log('ok', pages.length, 'pages');
