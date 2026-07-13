#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['.git', 'node_modules', 'vendor', '_site']);
const MARKER = 'AGVN IMAGE REPAIR v2';

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

function setAttr(tag, name, value) {
  const re = new RegExp(`\\b${name}\\s*=\\s*(["']).*?\\1`, 'i');
  if (re.test(tag)) return tag.replace(re, `${name}="${value}"`);
  return tag.replace(/\s*\/?\s*>$/, ending => ` ${name}="${value}"${ending}`);
}

function removeAttr(tag, name) {
  return tag.replace(new RegExp(`\\s+${name}\\s*=\\s*(["']).*?\\1`, 'ig'), '');
}

function addClass(tag, className) {
  const current = getAttr(tag, 'class');
  const classes = new Set(current.split(/\s+/).filter(Boolean));
  classes.add(className);
  return setAttr(tag, 'class', [...classes].join(' '));
}

function heroPicture() {
  return `<picture class="banner-picture">
  <source type="image/avif" srcset="/assets/performance/agvn-banner-640.avif 640w, /assets/performance/agvn-banner-960.avif 960w, /assets/performance/agvn-banner-1280.avif 1280w, /assets/performance/agvn-banner-1920.avif 1920w" sizes="100vw">
  <source type="image/webp" srcset="/assets/performance/agvn-banner-640.webp 640w, /assets/performance/agvn-banner-960.webp 960w, /assets/performance/agvn-banner-1280.webp 1280w, /assets/performance/agvn-banner-1920.webp 1920w" sizes="100vw">
  <img class="banner-img" src="/assets/performance/agvn-banner-1280.webp"
       srcset="/assets/performance/agvn-banner-640.webp 640w, /assets/performance/agvn-banner-960.webp 960w, /assets/performance/agvn-banner-1280.webp 1280w, /assets/performance/agvn-banner-1920.webp 1920w"
       sizes="100vw" width="2532" height="964" alt="Banner AGVN Group"
       loading="eager" decoding="async" fetchpriority="high"
       onerror="this.onerror=null;this.parentElement.querySelectorAll('source').forEach(function(s){s.remove()});this.removeAttribute('srcset');this.src='/AGVN%20Banner%202.jpg';">
</picture>`;
}

function repairHero(html, file) {
  if (path.basename(file).toLowerCase() !== 'index.html') return html;

  // Replace an existing performance picture completely.
  if (/<picture\b[^>]*class=["'][^"']*\bbanner-picture\b[^"']*["'][^>]*>[\s\S]*?<\/picture>/i.test(html)) {
    html = html.replace(
      /<picture\b[^>]*class=["'][^"']*\bbanner-picture\b[^"']*["'][^>]*>[\s\S]*?<\/picture>/i,
      heroPicture()
    );
  } else {
    // Replace the first banner image.
    let done = false;
    html = html.replace(/<img\b[^>]*>/gi, tag => {
      if (done) return tag;
      const cls = getAttr(tag, 'class');
      const src = getAttr(tag, 'src');
      const alt = getAttr(tag, 'alt');
      if (/\bbanner-img\b/i.test(cls) || /banner/i.test(src) || /banner/i.test(alt)) {
        done = true;
        return heroPicture();
      }
      return tag;
    });
  }

  // Ensure responsive banner CSS exists.
  if (!html.includes('id="agvn-image-repair-css"')) {
    const css = `<!-- ${MARKER} -->
<style id="agvn-image-repair-css">
.banner-picture{display:block;width:100%;line-height:0}
.banner-picture .banner-img{display:block;width:100%;height:auto;aspect-ratio:2532/964;object-fit:cover}
.lazy-agvn-img.is-loaded{opacity:1!important}
.product-image-box.is-loaded::after{display:none!important}
</style>`;
    html = html.replace(/<\/head>/i, `${css}\n</head>`);
  }
  return html;
}

function repairProductImages(html) {
  // Product box must not remain in a permanent loading state.
  html = html.replace(
    /class=(["'])([^"']*\bproduct-image-box\b[^"']*)\1/gi,
    (_, q, cls) => {
      const fixed = cls
        .split(/\s+/)
        .filter(Boolean)
        .filter(c => c !== 'is-loading');
      if (!fixed.includes('is-loaded')) fixed.push('is-loaded');
      return `class=${q}${fixed.join(' ')}${q}`;
    }
  );

  html = html.replace(/<img\b[^>]*>/gi, tag => {
    const cls = getAttr(tag, 'class');
    if (!/\blazy-agvn-img\b/i.test(cls)) return tag;

    let out = tag;
    const dataSrc = getAttr(out, 'data-src');
    if (dataSrc) {
      out = setAttr(out, 'src', dataSrc);
      out = removeAttr(out, 'data-src');
    }
    out = addClass(out, 'is-loaded');
    out = setAttr(out, 'loading', 'eager');
    out = setAttr(out, 'decoding', 'async');
    out = setAttr(out, 'fetchpriority', 'high');
    return out;
  });

  return html;
}

function repairOne(file) {
  const before = fs.readFileSync(file, 'utf8');
  let html = before;
  html = repairHero(html, file);
  html = repairProductImages(html);

  if (html !== before) {
    fs.writeFileSync(file, html, 'utf8');
    console.log('Repaired:', path.relative(ROOT, file));
    return true;
  }
  return false;
}

function verifyAssets() {
  const required = [
    'agvn-banner-640.avif',
    'agvn-banner-960.avif',
    'agvn-banner-1280.avif',
    'agvn-banner-1920.avif',
    'agvn-banner-640.webp',
    'agvn-banner-960.webp',
    'agvn-banner-1280.webp',
    'agvn-banner-1920.webp',
    'agvn-favicon-64.png'
  ];
  const dir = path.join(ROOT, 'assets', 'performance');
  const missing = required.filter(name => !fs.existsSync(path.join(dir, name)));
  if (missing.length) {
    console.error('Missing performance assets:', missing.join(', '));
    process.exitCode = 2;
  }
}

function main() {
  verifyAssets();
  let changed = 0;
  for (const file of walk(ROOT)) {
    if (repairOne(file)) changed++;
  }
  console.log(`Done. ${changed} HTML file(s) repaired.`);
}

main();
