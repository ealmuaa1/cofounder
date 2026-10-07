// Renders Musharaka Collective social images to PNG.
// Usage: node build.mjs   (outputs to ../images)
import { createRequire } from 'module';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'images');

const C = { green: '#0E3B2E', green2: '#14503E', gold: '#C9A24A', gold2: '#E3C77E', cream: '#F7F2E7', ink: '#1C2B25' };

// 8-point star tile pattern (Islamic geometric motif)
const star = (s, stroke, op) => {
  const h = s / 2, r = s * 0.32;
  const sq = (rot) => `<rect x="${h - r}" y="${h - r}" width="${2 * r}" height="${2 * r}" transform="rotate(${rot} ${h} ${h})" fill="none" stroke="${stroke}" stroke-width="1.4"/>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${s}' height='${s}' opacity='${op}'>${sq(0)}${sq(45)}<circle cx='${h}' cy='${h}' r='${r * 0.42}' fill='none' stroke='${stroke}' stroke-width='1.4'/></svg>`
  )}")`;
};

// Logo mark: 8-point star framing the Arabic letter meem (Musharaka)
const logo = (size, color = C.gold) => `
<svg width="${size}" height="${size}" viewBox="0 0 100 100">
  <g fill="none" stroke="${color}" stroke-width="3.2">
    <rect x="18" y="18" width="64" height="64"/>
    <rect x="18" y="18" width="64" height="64" transform="rotate(45 50 50)"/>
  </g>
  <text x="50" y="50" text-anchor="middle" dominant-baseline="central" font-family="Amiri, serif" font-weight="700" font-size="40" fill="${color}" dy="-4">م</text>
</svg>`;

const base = `
<link href="fonts/fonts.css" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Inter,sans-serif;color:${C.cream};-webkit-font-smoothing:antialiased}
  .frame{position:relative;overflow:hidden;background:${C.green};
    background-image:radial-gradient(ellipse at 50% 40%, ${C.green2} 0%, ${C.green} 70%), ${star(90, C.gold, 0.13)};
    background-blend-mode:normal}
  .pattern{position:absolute;inset:0;background-image:${star(90, C.gold, 0.12)};pointer-events:none}
  .border{position:absolute;border:2px solid ${C.gold};opacity:.55;pointer-events:none}
  .serif{font-family:'Cormorant Garamond',serif}
  .ar{font-family:Tajawal,sans-serif;direction:rtl}
  .amiri{font-family:Amiri,serif;direction:rtl}
  .gold{color:${C.gold2}}
  .rule{height:2px;background:linear-gradient(90deg,transparent,${C.gold},transparent)}
  .eyebrow{letter-spacing:.32em;text-transform:uppercase;font-weight:600;color:${C.gold2}}
  .center{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
</style>`;

const page = (w, h, body) => `<!doctype html><html><head><meta charset="utf-8">${base}</head>
<body><div class="frame" style="width:${w}px;height:${h}px"><div class="pattern"></div>${body}</div></body></html>`;

const brandFooter = `
  <div style="position:absolute;bottom:56px;left:0;right:0" class="center">
    <div style="display:flex;align-items:center;gap:14px">${logo(44)}
      <div style="text-align:left"><div class="serif" style="font-size:30px;font-weight:700;line-height:1">Musharaka Collective</div>
      <div class="ar" style="font-size:20px;color:${C.gold2};text-align:left;direction:ltr">مجتمع مشاركة</div></div>
    </div>
  </div>`;

const images = {
  // Facebook group cover — 1640x856; key content kept in centre safe zone (mobile crops sides)
  'cover': [1640, 856, `
    <div class="border" style="inset:28px"></div>
    <div class="center" style="position:absolute;inset:0">
      ${logo(120)}
      <div class="serif" style="font-size:104px;font-weight:700;margin-top:18px;line-height:1">Musharaka Collective</div>
      <div class="ar" style="font-size:56px;font-weight:700;color:${C.gold2};margin-top:8px">مجتمع مشاركة</div>
      <div class="rule" style="width:620px;margin:26px 0"></div>
      <div style="font-size:34px;font-weight:500;letter-spacing:.04em">Partners in Halal Business <span class="gold">·</span> <span class="ar" style="font-weight:500">شركاء في الحلال</span></div>
      <div class="eyebrow" style="font-size:20px;margin-top:22px">Arab &amp; Muslim Co-Founders · Investors · Business Owners · USA</div>
    </div>`],

  // Post 1 — Welcome (4:5)
  'post1-welcome': [1080, 1350, `
    <div class="border" style="inset:36px"></div>
    <div class="center" style="position:absolute;inset:0;padding:0 110px 120px">
      <div class="eyebrow" style="font-size:24px">Now open · الآن مفتوح</div>
      <div class="amiri" style="font-size:64px;margin-top:40px;color:${C.gold2}">السلام عليكم</div>
      <div class="serif" style="font-size:96px;font-weight:700;line-height:1.02;margin-top:24px">Welcome to<br>Musharaka<br>Collective</div>
      <div class="rule" style="width:420px;margin:44px 0"></div>
      <div style="font-size:36px;line-height:1.4;font-weight:500">Where serious Arab &amp; Muslim entrepreneurs find partners to build <span class="gold">halal businesses</span> together.</div>
      <div class="ar" style="font-size:36px;line-height:1.6;margin-top:28px;font-weight:500">حيث يلتقي رواد الأعمال الجادّون لبناء مشاريع <span class="gold">حلال</span> معاً</div>
      <div style="margin-top:48px;padding:20px 40px;border:2px solid ${C.gold};border-radius:999px;font-size:28px;font-weight:600;color:${C.gold2}">👋 Introduce yourself below · عرّف بنفسك</div>
    </div>${brandFooter}`],

  // Post 2 — Who this group is for (4:5)
  'post2-who': [1080, 1350, `
    <div class="border" style="inset:36px"></div>
    <div style="position:absolute;inset:0;padding:110px 96px 0">
      <div class="center">
        <div class="eyebrow" style="font-size:24px">Find your partner · ابحث عن شريكك</div>
        <div class="serif" style="font-size:80px;font-weight:700;line-height:1.05;margin-top:22px">Which one are you?</div>
        <div class="ar" style="font-size:46px;font-weight:700;color:${C.gold2};margin-top:6px">من أنت؟</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:56px">
        ${[
          ['💡', 'Idea Holder', 'صاحب فكرة', 'You have the vision. You need the team.'],
          ['🛠️', 'Expert', 'صاحب خبرة', 'You have the skills to build and grow it.'],
          ['💰', 'Investor', 'مستثمر', 'You have capital for halal ventures.'],
          ['📈', 'Business Owner', 'صاحب عمل', 'You have a proven system ready to scale.'],
        ].map(([e, en, ar, d]) => `
          <div style="background:rgba(247,242,231,.06);border:1.5px solid rgba(201,162,74,.55);border-radius:22px;padding:38px 32px;text-align:center">
            <div style="font-size:64px">${e}</div>
            <div class="serif" style="font-size:46px;font-weight:700;margin-top:10px">${en}</div>
            <div class="ar" style="font-size:34px;font-weight:700;color:${C.gold2}">${ar}</div>
            <div style="font-size:24px;line-height:1.4;margin-top:12px;opacity:.88">${d}</div>
          </div>`).join('')}
      </div>
      <div class="center" style="margin-top:44px;font-size:30px;font-weight:600">Comment yours below 👇 <span class="ar" style="margin-left:14px">اكتب نوعك في التعليقات</span></div>
    </div>${brandFooter}`],

  // Post 3 — What is Musharaka? (4:5)
  'post3-what-is-musharaka': [1080, 1350, `
    <div class="border" style="inset:36px"></div>
    <div class="center" style="position:absolute;inset:0;padding:0 96px 70px">
      <div class="eyebrow" style="font-size:24px">Islamic business 101</div>
      <div class="serif" style="font-size:84px;font-weight:700;line-height:1.05;margin-top:22px">What is Musharaka?</div>
      <div class="ar" style="font-size:52px;font-weight:700;color:${C.gold2};margin-top:4px">ما هي المشاركة؟</div>
      <div style="display:flex;align-items:center;gap:22px;margin-top:56px">
        ${[['💰', 'Capital', 'رأس المال'], ['🤝', 'Effort', 'العمل والخبرة']].map(([e, en, ar]) => `
          <div style="width:250px;padding:30px 18px;border:1.5px solid rgba(201,162,74,.6);border-radius:22px;background:rgba(247,242,231,.06)">
            <div style="font-size:58px">${e}</div><div style="font-size:32px;font-weight:700;margin-top:6px">${en}</div>
            <div class="ar" style="font-size:28px;color:${C.gold2}">${ar}</div></div>`).join(`<div class="serif gold" style="font-size:70px;font-weight:700">+</div>`)}
        <div class="serif gold" style="font-size:70px;font-weight:700">=</div>
        <div style="width:250px;padding:30px 18px;border:2px solid ${C.gold};border-radius:22px;background:rgba(201,162,74,.18)">
          <div style="font-size:58px">🌱</div><div style="font-size:32px;font-weight:700;margin-top:6px">Shared Profit</div>
          <div class="ar" style="font-size:28px;color:${C.gold2}">ربح مشترك</div></div>
      </div>
      <div style="text-align:left;margin-top:56px;font-size:31px;line-height:1.75;width:100%">
        <div>✦ Partners pool money and/or skills into one venture</div>
        <div>✦ Profit is split by a ratio agreed upfront</div>
        <div>✦ Losses are shared by each partner's capital share</div>
        <div>✦ No interest (riba): risk and reward are shared fairly</div>
      </div>
      <div class="rule" style="width:420px;margin:40px 0 26px"></div>
      <div class="ar" style="font-size:30px;line-height:1.7">شراكة عادلة: الربح بحسب الاتفاق، والخسارة بقدر رأس المال</div>
    </div>${brandFooter}`],

  // Post 4 — How to introduce yourself (4:5)
  'post4-intro-template': [1080, 1350, `
    <div class="border" style="inset:36px"></div>
    <div style="position:absolute;inset:0;padding:0 110px 80px;display:flex;flex-direction:column;justify-content:center">
      <div class="center">
        <div class="eyebrow" style="font-size:24px">Step 1 · الخطوة الأولى</div>
        <div class="serif" style="font-size:80px;font-weight:700;line-height:1.05;margin-top:22px">Introduce Yourself</div>
        <div class="ar" style="font-size:46px;font-weight:700;color:${C.gold2};margin-top:6px">عرّف بنفسك</div>
      </div>
      <div style="margin-top:50px;background:${C.cream};color:${C.ink};border-radius:24px;padding:44px 52px;font-size:32px;line-height:1.85;box-shadow:0 20px 60px rgba(0,0,0,.3)">
        ${[['📛', 'Name', 'الاسم'], ['📍', 'City / State', 'المدينة'], ['🧭', 'I am', 'أنا'], ['🛠️', 'What I bring', 'ماذا أقدّم'], ['🔍', "What I'm looking for", 'ماذا أبحث عنه'], ['🏷️', 'Industry', 'المجال'], ['⏰', 'Time I can commit', 'الوقت المتاح']]
          .map(([e, en, ar]) => `<div style="display:flex;justify-content:space-between;border-bottom:1px dashed rgba(14,59,46,.25)"><span>${e} <b>${en}:</b></span><span class="ar" style="color:${C.green2};font-weight:700">${ar}</span></div>`).join('')}
      </div>
      <div class="center" style="margin-top:40px;font-size:28px;line-height:1.5;opacity:.92">Copy the template from the pinned post and share yours 👇</div>
    </div>${brandFooter}`],


  // Quote card — partner > idea (1:1)
  'quote-partner': [1080, 1080, `
    <div class="border" style="inset:36px"></div>
    <div class="center" style="position:absolute;inset:0;padding:0 120px 90px">
      <div class="serif gold" style="font-size:220px;line-height:.6;height:110px">&ldquo;</div>
      <div class="serif" style="font-size:76px;font-weight:600;line-height:1.12">Most partnerships don't fail because of the <span class="gold">idea</span>.</div>
      <div class="serif" style="font-size:76px;font-weight:700;line-height:1.12;margin-top:26px">They fail because of the <span class="gold">partner</span>.</div>
      <div class="rule" style="width:360px;margin:46px 0 0"></div>
    </div>${brandFooter}`],

  // Checklist promo (4:5)
  'checklist-promo': [1080, 1350, `
    <div class="border" style="inset:36px"></div>
    <div class="center" style="position:absolute;inset:0;padding:0 100px 120px">
      <div style="padding:12px 30px;border-radius:999px;background:${C.gold};color:${C.green};font-weight:800;font-size:28px;letter-spacing:.2em">FREE GUIDE</div>
      <div class="serif" style="font-size:96px;font-weight:700;line-height:1.02;margin-top:36px">The Partnership<br>Agreement<br>Checklist</div>
      <div style="font-size:34px;line-height:1.45;margin-top:30px;opacity:.92">15 things to agree on <b class="gold">before</b> you partner with anyone</div>
      <div style="margin-top:44px;background:${C.cream};color:${C.ink};border-radius:20px;padding:30px 44px;text-align:left;font-size:29px;line-height:1.8;box-shadow:0 20px 60px rgba(0,0,0,.3)">
        ☐ Who brings what<br>☐ Profit &amp; loss split<br>☐ Vesting &amp; salaries<br>☐ Deadlocks &amp; decisions<br>☐ The exit plan
      </div>
      <div style="margin-top:40px;font-size:30px;font-weight:600;color:${C.gold2}">📌 Free inside the group</div>
    </div>${brandFooter}`],

  // 5 red flags (4:5)
  'red-flags': [1080, 1350, `
    <div class="border" style="inset:36px"></div>
    <div style="position:absolute;inset:0;padding:0 100px 120px;display:flex;flex-direction:column;justify-content:center">
      <div class="center">
        <div class="eyebrow" style="font-size:24px">Before you sign anything</div>
        <div class="serif" style="font-size:88px;font-weight:700;line-height:1.05;margin-top:18px">5 Red Flags<br>in a Partner 🚩</div>
      </div>
      <div style="margin-top:50px;font-size:34px;line-height:1.35">
        ${['Vague about their own money or past deals', 'Wants a big share before contributing anything', 'Avoids putting things in writing', 'Blames others for every past failure', 'Pushes you to commit fast']
          .map((t, i) => `<div style="display:flex;gap:26px;align-items:center;padding:22px 0;border-bottom:1px solid rgba(201,162,74,.35)"><div class="serif gold" style="font-size:64px;font-weight:700;width:50px">${i + 1}</div><div>${t}</div></div>`).join('')}
      </div>
      <div class="center" style="margin-top:40px;font-size:28px;opacity:.9">Which one have you seen? 👇</div>
    </div>${brandFooter}`],

  // 4 ingredients (1:1)
  'four-ingredients': [1080, 1080, `
    <div class="border" style="inset:36px"></div>
    <div style="position:absolute;inset:0;padding:110px 96px 0">
      <div class="center">
        <div class="eyebrow" style="font-size:22px">Every business needs 4 things</div>
        <div class="serif" style="font-size:72px;font-weight:700;line-height:1.05;margin-top:16px">Which one are <span class="gold">you</span> missing?</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:46px">
        ${[['💡', 'Idea', 'A problem worth solving'], ['🛠️', 'Skills', 'Someone who can build & sell'], ['💰', 'Capital', 'Money to start & grow'], ['🤝', 'Customers', 'People who will pay']]
          .map(([e, t, d]) => `<div style="background:rgba(247,242,231,.06);border:1.5px solid rgba(201,162,74,.55);border-radius:22px;padding:30px 24px;text-align:center"><div style="font-size:56px">${e}</div><div class="serif" style="font-size:46px;font-weight:700">${t}</div><div style="font-size:24px;opacity:.88;margin-top:4px">${d}</div></div>`).join('')}
      </div>
      <div class="center" style="margin-top:34px;font-size:28px;font-weight:600">The right partner brings what you don't 👇</div>
    </div>${brandFooter}`],

  // 7 steps summary (4:5)
  'seven-steps': [1080, 1350, `
    <div class="border" style="inset:36px"></div>
    <div style="position:absolute;inset:0;padding:0 96px 120px;display:flex;flex-direction:column;justify-content:center">
      <div class="center">
        <div class="eyebrow" style="font-size:22px">Save this 📌</div>
        <div class="serif" style="font-size:80px;font-weight:700;line-height:1.05;margin-top:16px">How to Test a Partner<br>in 7 Steps</div>
      </div>
      <div style="margin-top:44px;font-size:31px;line-height:1.3">
        ${['List what you bring & what you lack', 'Agree on the goal before the work', 'Run a 30-day test project', 'Watch: promises, pressure, money, solutions', 'Split roles: one owner per area', 'Agree on money & vesting upfront', 'Plan the exit before you start']
          .map((t, i) => `<div style="display:flex;gap:22px;align-items:center;padding:15px 0;border-bottom:1px solid rgba(201,162,74,.3)"><div style="width:52px;height:52px;border-radius:50%;background:${C.gold};color:${C.green};font-weight:800;font-size:26px;display:flex;align-items:center;justify-content:center;flex:none">${i + 1}</div><div>${t}</div></div>`).join('')}
      </div>
    </div>${brandFooter}`],

  // Profile picture for the Page/group — 1080x1080, logo only
  'profile-logo': [1080, 1080, `
    <div class="center" style="position:absolute;inset:0">
      ${logo(560)}
      <div class="serif" style="font-size:84px;font-weight:700;margin-top:20px;line-height:1">Musharaka</div>
      <div class="eyebrow" style="font-size:30px;margin-top:10px">Collective</div>
    </div>`],
};

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(() => chromium.launch());
for (const [name, [w, h, body]] of Object.entries(images)) {
  const html = page(w, h, body);
  writeFileSync(join(here, `${name}.html`), html);
  const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.goto('file://' + join(here, `${name}.html`), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: join(out, `${name}.png`), clip: { x: 0, y: 0, width: w, height: h } });
  await p.close();
  console.log('rendered', name);
}
await browser.close();
