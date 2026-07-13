#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MARKER = 'AGVN PERFORMANCE PATCH v1';
const SKIP_DIRS = new Set(['.git', 'node_modules', 'vendor', '_site']);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) out.push(full);
  }
  return out;
}

function getAttr(tag, name) {
  const re = new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i');
  const m = tag.match(re);
  return m ? m[2] : '';
}

function hasAttr(tag, name) {
  return new RegExp(`\\b${name}\\s*=`, 'i').test(tag);
}

function setAttr(tag, name, value) {
  const re = new RegExp(`\\b${name}\\s*=\\s*(["']).*?\\1`, 'i');
  if (re.test(tag)) return tag.replace(re, `${name}="${value}"`);
  return tag.replace(/\s*\/?\s*>$/, (ending) => ` ${name}="${value}"${ending}`);
}

function removeAttr(tag, name) {
  return tag.replace(new RegExp(`\\s+${name}\\s*=\\s*(["']).*?\\1`, 'ig'), '');
}

function patchAsyncStyles(html) {
  if (!html.includes('data-agvn-async-css')) {
    html = html.replace(
      /<link\b(?=[^>]*\bhref=["'](https:\/\/fonts\.googleapis\.com\/css2\?[^"']+)["'])[^>]*>/gi,
      (_, href) => `<!-- ${MARKER}: non-blocking Google Fonts -->\n<link rel="preload" as="style" href="${href}" onload="this.onload=null;this.rel='stylesheet'" data-agvn-async-css="google-fonts">\n<noscript><link rel="stylesheet" href="${href}"></noscript>`
    );

    html = html.replace(
      /<link\b(?=[^>]*\bhref=["'](https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/[^"']+\/css\/all(?:\.min)?\.css)["'])[^>]*>/gi,
      (_, href) => `<!-- ${MARKER}: non-blocking Font Awesome -->\n<link rel="preload" as="style" href="${href}" onload="this.onload=null;this.rel='stylesheet'" data-agvn-async-css="font-awesome">\n<noscript><link rel="stylesheet" href="${href}"></noscript>`
    );
  }

  html = html.replace(
    /<link\b(?=[^>]*\bhref=["'](https:\/\/unpkg\.com\/aos@[^"']+\/dist\/aos\.css)["'])[^>]*>/gi,
    (_, href) => `<link rel="stylesheet" href="${href}" media="(min-width: 769px)" data-agvn-desktop-only="aos">`
  );
  return html;
}

function aosLoader() {
  return `<!-- ${MARKER}: AOS disabled on mobile and delayed on desktop -->
<script id="agvn-aos-loader">
(function(w,d){
  var opts={duration:700,once:true,offset:60};
  var pending=opts;
  w.AOS={init:function(o){pending=o||opts;},refresh:function(){},refreshHard:function(){}};
  if(!w.matchMedia || w.matchMedia('(max-width: 768px)').matches || w.matchMedia('(prefers-reduced-motion: reduce)').matches){return;}
  function load(){
    if(d.getElementById('agvn-aos-lib')) return;
    var s=d.createElement('script');
    s.id='agvn-aos-lib';
    s.src='https://unpkg.com/aos@2.3.1/dist/aos.js';
    s.defer=true;
    s.onload=function(){ if(w.AOS && w.AOS.init){ w.AOS.init(pending||opts); } };
    d.head.appendChild(s);
  }
  if('requestIdleCallback' in w){ w.requestIdleCallback(load,{timeout:3500}); }
  else { w.setTimeout(load,2200); }
})(window,document);
</script>`;
}

function patchAosJs(html) {
  if (html.includes('id="agvn-aos-loader"')) return html;
  return html.replace(
    /<script\b[^>]*\bsrc=["']https:\/\/unpkg\.com\/aos@[^"']+\/dist\/aos\.js["'][^>]*>\s*<\/script>/gi,
    aosLoader()
  );
}

function findGaId(html) {
  const a = html.match(/googletagmanager\.com\/gtag\/js\?id=(G-[A-Z0-9]+)/i);
  if (a) return a[1];
  const b = html.match(/gtag\(\s*["']config["']\s*,\s*["'](G-[A-Z0-9]+)["']/i);
  return b ? b[1] : '';
}

function gaLoader(id) {
  return `<!-- ${MARKER}: delayed GA4; loads on interaction or after 12 seconds -->
<script id="agvn-ga4-delayed">
(function(w,d,id){
  w.dataLayer=w.dataLayer||[];
  w.gtag=w.gtag||function(){w.dataLayer.push(arguments);};
  var loaded=false;
  function load(){
    if(loaded) return;
    loaded=true;
    var s=d.createElement('script');
    s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);
    s.onload=function(){ w.gtag('js',new Date()); w.gtag('config',id); };
    d.head.appendChild(s);
    ['pointerdown','touchstart','keydown'].forEach(function(evt){w.removeEventListener(evt,load,true);});
  }
  ['pointerdown','touchstart','keydown'].forEach(function(evt){w.addEventListener(evt,load,{once:true,capture:true,passive:true});});
  w.setTimeout(load,12000);
})(window,document,'${id}');
</script>`;
}

function patchGa4(html) {
  if (html.includes('id="agvn-ga4-delayed"')) return html;
  const id = findGaId(html);
  if (!id) return html;

  html = html.replace(
    /<script\b[^>]*\bsrc=["']https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=[^"']+["'][^>]*>\s*<\/script>/gi,
    ''
  );

  html = html.replace(/<script\b(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/gi, (block) => {
    if (/window\.dataLayer|dataLayer\s*=/.test(block) && /\bgtag\s*\(/.test(block) && block.includes(id)) return '';
    return block;
  });

  return html.replace(/<\/head>/i, `${gaLoader(id)}\n</head>`);
}

function heroPicture() {
  return `<picture class="banner-picture">
  <source type="image/avif" srcset="/assets/performance/agvn-banner-640.avif 640w, /assets/performance/agvn-banner-960.avif 960w, /assets/performance/agvn-banner-1280.avif 1280w, /assets/performance/agvn-banner-1920.avif 1920w" sizes="100vw">
  <source type="image/webp" srcset="/assets/performance/agvn-banner-640.webp 640w, /assets/performance/agvn-banner-960.webp 960w, /assets/performance/agvn-banner-1280.webp 1280w, /assets/performance/agvn-banner-1920.webp 1920w" sizes="100vw">
  <img class="banner-img" src="/assets/performance/agvn-banner-1280.webp" srcset="/assets/performance/agvn-banner-640.webp 640w, /assets/performance/agvn-banner-960.webp 960w, /assets/performance/agvn-banner-1280.webp 1280w, /assets/performance/agvn-banner-1920.webp 1920w" sizes="100vw" width="2532" height="964" alt="Banner AGVN Group" loading="eager" decoding="async" fetchpriority="high">
</picture>`;
}

function patchHero(html) {
  if (html.includes('/assets/performance/agvn-banner-640.avif')) return html;
  let replaced = false;
  html = html.replace(/<img\b[^>]*>/gi, (tag) => {
    if (replaced) return tag;
    const cls = getAttr(tag, 'class');
    const src = getAttr(tag, 'src');
    if (/\bbanner-img\b/i.test(cls) && (/banner/i.test(src) || !src)) {
      replaced = true;
      return heroPicture();
    }
    return tag;
  });

  if (!replaced) return html;
  const preload = `<!-- ${MARKER}: responsive LCP image preload -->\n<link rel="preload" as="image" type="image/avif" href="/assets/performance/agvn-banner-640.avif" imagesrcset="/assets/performance/agvn-banner-640.avif 640w, /assets/performance/agvn-banner-960.avif 960w, /assets/performance/agvn-banner-1280.avif 1280w, /assets/performance/agvn-banner-1920.avif 1920w" imagesizes="100vw" fetchpriority="high">`;
  return html.replace(/<\/head>/i, `${preload}\n</head>`);
}

function patchFavicon(html) {
  return html.replace(/<link\b[^>]*\brel=["'](?:shortcut\s+icon|icon)["'][^>]*>/gi, (tag) => {
    if (!/AGVN_Logo|agvn-favicon|favicon/i.test(tag)) return tag;
    let out = setAttr(tag, 'href', '/assets/performance/agvn-favicon-64.png');
    out = setAttr(out, 'type', 'image/png');
    out = setAttr(out, 'sizes', '64x64');
    return out;
  });
}

function patchImages(html) {
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    const cls = getAttr(tag, 'class');
    const high = /\bbanner-img\b|\bproduct-main-img\b|\blazy-agvn-img\b|\barticle-featured-img\b/i.test(cls);
    let out = tag;
    out = setAttr(out, 'decoding', 'async');
    if (high) {
      const dataSrc = getAttr(out, 'data-src');
      if (dataSrc) {
        out = setAttr(out, 'src', dataSrc);
        out = removeAttr(out, 'data-src');
      }
      out = setAttr(out, 'loading', 'eager');
      out = setAttr(out, 'fetchpriority', 'high');
    } else {
      if (!hasAttr(out, 'loading')) out = setAttr(out, 'loading', 'lazy');
      if (!hasAttr(out, 'fetchpriority')) out = setAttr(out, 'fetchpriority', 'low');
    }
    return out;
  });
}

function performanceCss() {
  return `<!-- ${MARKER}: mobile rendering safeguards -->
<style id="agvn-performance-css">
.banner-picture{display:block;width:100%;line-height:0}.banner-picture .banner-img{display:block;width:100%;height:auto;aspect-ratio:2532/964}
@media(max-width:768px){
  [data-aos]{opacity:1!important;transform:none!important;transition:none!important;animation:none!important}
  .about-section,.product-section,.testimonial-section,.news-section,.latest-news,footer,.agvn-site-footer{content-visibility:auto;contain-intrinsic-size:1px 850px}
  .floating-buttons .float-btn,.agvn-floating-buttons .float-btn{animation:none!important}
}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
</style>`;
}

function patchCss(html) {
  if (html.includes('id="agvn-performance-css"')) return html;
  return html.replace(/<\/head>/i, `${performanceCss()}\n</head>`);
}

function patchOne(file) {
  const before = fs.readFileSync(file, 'utf8');
  let html = before;
  html = patchAsyncStyles(html);
  html = patchAosJs(html);
  html = patchGa4(html);
  html = patchHero(html);
  html = patchFavicon(html);
  html = patchImages(html);
  html = patchCss(html);

  if (html !== before) {
    fs.writeFileSync(file, html, 'utf8');
    return true;
  }
  return false;
}


function patchGenerateJs() {
  const file = path.join(ROOT, 'generate.js');
  if (!fs.existsSync(file)) return false;
  const before = fs.readFileSync(file, 'utf8');
  let out = before;

  // Bài mới nhất là nội dung đầu trang Tin tức: không lazy-load ảnh LCP.
  out = out.replace(
    /(<div class=["']latest-card-img["']>\s*<img\b[^>]*?)loading=["']lazy["']([^>]*>)/g,
    '$1loading="eager" fetchpriority="high"$2'
  );

  // Tránh thêm fetchpriority nhiều lần nếu workflow chạy lại.
  out = out.replace(/fetchpriority=["']high["']\s+fetchpriority=["']high["']/g, 'fetchpriority="high"');

  if (out !== before) {
    fs.writeFileSync(file, out, 'utf8');
    console.log('Patched: generate.js');
    return true;
  }
  return false;
}

function main() {
  const files = walk(ROOT);
  let changed = 0;
  for (const file of files) {
    if (patchOne(file)) {
      changed++;
      console.log('Patched:', path.relative(ROOT, file));
    }
  }
  if (patchGenerateJs()) changed++;
  console.log(`\n${MARKER}: ${changed} files changed (${files.length} HTML files scanned).`);
  console.log('Optimized hero assets are in assets/performance/.');
}

main();
