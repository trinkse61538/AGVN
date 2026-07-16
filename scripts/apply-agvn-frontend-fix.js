'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const AOS_MARKER = 'id="agvn-aos-desktop-failsafe"';
const IMAGE_MARKER = 'id="agvn-native-image-failsafe"';

const AOS_FAILSAFE = `
<!-- AGVN FIX: always keep content visible if AOS is slow or unavailable -->
<style id="agvn-aos-desktop-failsafe">
@media (min-width: 769px) {
  [data-aos] {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
    animation: none !important;
  }
}
</style>`;

const IMAGE_FAILSAFE = `
<!-- AGVN FIX: native image loading must never remain transparent -->
<style id="agvn-native-image-failsafe">
.agvn-lazy-img,
.lazy-img,
.agvn-lazy-image,
.article-featured-img,
.product-image-box img {
  opacity: 1 !important;
  filter: none !important;
}
.ci-img,
.product-image-box,
.latest-card-img,
.news-card-img {
  background-color: #f4f8f5;
}
</style>`;

function exists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeText(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

function insertBeforeHeadClose(html, snippet) {
  if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, `${snippet}\n</head>`);
  return `${snippet}\n${html}`;
}

function getAttr(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}=(['"])([\\s\\S]*?)\\1`, 'i'));
  return match ? match[2] : '';
}

function removeAttr(tag, name) {
  return tag.replace(new RegExp(`\\s${name}=(['"])([\\s\\S]*?)\\1`, 'ig'), '');
}

function setAttr(tag, name, value) {
  const safeValue = String(value).replace(/"/g, '&quot;');
  const pattern = new RegExp(`\\s${name}=(['"])([\\s\\S]*?)\\1`, 'i');
  if (pattern.test(tag)) return tag.replace(pattern, ` ${name}="${safeValue}"`);
  return tag.replace(/<img\b/i, `<img ${name}="${safeValue}"`);
}

function addAosFailsafe(html) {
  if (html.includes(AOS_MARKER) || !/data-aos\s*=/i.test(html)) return html;

  const aosCss = /<link\b[^>]*href=(['"])[^'"]*aos@2\.3\.1\/dist\/aos\.css[^'"]*\1[^>]*>/i;
  if (aosCss.test(html)) {
    return html.replace(aosCss, (match) => `${match}${AOS_FAILSAFE}`);
  }
  return insertBeforeHeadClose(html, AOS_FAILSAFE);
}

function addImageFailsafe(html) {
  if (html.includes(IMAGE_MARKER)) return html;
  return insertBeforeHeadClose(html, IMAGE_FAILSAFE);
}

function cdnizeRawGitHub(html) {
  return html.replace(
    /https:\/\/raw\.githubusercontent\.com\/([^/\s"'<>]+)\/([^/\s"'<>]+)\/([^/\s"'<>]+)\/([^\s"'<>]+)/gi,
    (_match, owner, repo, ref, filePath) => `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${ref}/${filePath}`
  );
}

function patchHomepageBanner(html) {
  const directPreload = '<link rel="preload" as="image" href="/AGVN%20Banner%202.jpg" fetchpriority="high">';

  html = html.replace(
    /<link\b[^>]*href=(['"])[^'"]*\/assets\/performance\/agvn-banner-[^'"]+\1[^>]*>/gi,
    directPreload
  );

  if (!html.includes('href="/AGVN%20Banner%202.jpg"')) {
    html = insertBeforeHeadClose(html, `\n<!-- AGVN FIX: preload the banner file that actually exists -->\n${directPreload}`);
  }

  html = html.replace(
    /<picture\b[^>]*class=(['"])[^'"]*\bbanner-picture\b[^'"]*\1[^>]*>[\s\S]*?<\/picture>/i,
    '<img class="banner-img" src="/AGVN%20Banner%202.jpg" width="2532" height="964" alt="Banner AGVN Group" loading="eager" decoding="async" fetchpriority="high">'
  );

  return html;
}

function convertDataSrcImages(html, eagerCount = 0) {
  let converted = 0;

  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    const dataSrc = getAttr(tag, 'data-src');
    if (!dataSrc) return tag;

    converted += 1;
    let next = removeAttr(tag, 'data-src');
    next = removeAttr(next, 'src');
    next = setAttr(next, 'src', dataSrc);
    next = setAttr(next, 'decoding', 'async');

    if (converted <= eagerCount) {
      next = setAttr(next, 'loading', 'eager');
      next = setAttr(next, 'fetchpriority', 'high');
    } else {
      next = setAttr(next, 'loading', 'lazy');
      next = setAttr(next, 'fetchpriority', 'auto');
    }

    return next;
  });
}

function patchNewsTemplateFeaturedImage(html) {
  return html.replace(/<img\b[^>]*class=(['"])[^'"]*\barticle-featured-img\b[^'"]*\1[^>]*>/i, (tag) => {
    let next = removeAttr(tag, 'data-src');
    next = removeAttr(next, 'src');
    next = setAttr(next, 'src', '{{ImageURL}}');
    next = setAttr(next, 'loading', 'eager');
    next = setAttr(next, 'decoding', 'async');
    next = setAttr(next, 'fetchpriority', 'high');
    return next;
  });
}

function patchProductTemplateMainImage(html) {
  return html.replace(/<img\b[^>]*class=(['"])[^'"]*(?:lazy-agvn-img|product-main-image)[^'"]*\1[^>]*>/i, (tag) => {
    let next = setAttr(tag, 'loading', 'eager');
    next = setAttr(next, 'decoding', 'async');
    next = setAttr(next, 'fetchpriority', 'high');
    return next;
  });
}

function collectHtmlFiles() {
  const files = [
    'index.html',
    'aboutus.html',
    'AGVN_product.html',
    'quytrinhcanhtaclua.html',
    'product_template.html',
    'news_template.html',
    'tintuc_template.html',
    'tintuc.html',
  ].map((name) => path.join(ROOT, name));

  for (const dirName of ['san-pham', 'tin-tuc']) {
    const dirPath = path.join(ROOT, dirName);
    if (!exists(dirPath)) continue;
    for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
        files.push(path.join(dirPath, entry.name));
      }
    }
  }

  return [...new Set(files)].filter(exists);
}

function patchFile(filePath) {
  const relative = path.relative(ROOT, filePath).replace(/\\/g, '/');
  const original = readText(filePath);
  let html = original;

  html = cdnizeRawGitHub(html);
  html = addAosFailsafe(html);

  if (relative === 'index.html') {
    html = patchHomepageBanner(html);
    html = convertDataSrcImages(html, 2);
    html = addImageFailsafe(html);
  } else if (relative === 'AGVN_product.html') {
    html = convertDataSrcImages(html, 4);
    html = addImageFailsafe(html);
  } else if (relative === 'tintuc.html') {
    html = convertDataSrcImages(html, 1);
    html = addImageFailsafe(html);
  } else if (relative === 'news_template.html') {
    html = patchNewsTemplateFeaturedImage(html);
    html = addImageFailsafe(html);
  } else if (relative === 'product_template.html') {
    html = patchProductTemplateMainImage(html);
    html = addImageFailsafe(html);
  } else if (relative === 'tintuc_template.html') {
    html = convertDataSrcImages(html, 1);
    html = addImageFailsafe(html);
  } else if (relative.startsWith('san-pham/') || relative.startsWith('tin-tuc/')) {
    html = convertDataSrcImages(html, 1);
    html = addImageFailsafe(html);
  }

  if (html === original) return false;
  writeText(filePath, html);
  console.log(`✅ Đã sửa: ${relative}`);
  return true;
}

function main() {
  const files = collectHtmlFiles();
  let changed = 0;

  for (const filePath of files) {
    try {
      if (patchFile(filePath)) changed += 1;
    } catch (error) {
      console.error(`❌ Không thể sửa ${path.relative(ROOT, filePath)}: ${error.message}`);
      process.exitCode = 1;
    }
  }

  console.log(`\n🎉 Hoàn tất. ${changed}/${files.length} file HTML đã được cập nhật.`);
  console.log('ℹ️ Bước tiếp theo: chạy generate.js để tạo lại trang sản phẩm và tin tức từ template đã sửa.');
}

main();
