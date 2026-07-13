#!/usr/bin/env node
'use strict';

/**
 * AGVN Homepage Performance Patch v3
 *
 * Mục tiêu:
 * 1. Không tải YouTube player trong lần tải trang đầu tiên.
 * 2. Chỉ tạo iframe YouTube sau khi người dùng bấm nút phát.
 * 3. Loại bỏ AOS khỏi trang chủ.
 * 4. Loại bỏ Font Awesome nặng khỏi trang chủ và dùng icon CSS nhỏ.
 *
 * Script có thể chạy lại nhiều lần mà không chèn patch trùng.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');

const CSS_MARKER_START = '<!-- AGVN PERFORMANCE V3 CSS START -->';
const CSS_MARKER_END = '<!-- AGVN PERFORMANCE V3 CSS END -->';
const JS_MARKER_START = '<!-- AGVN PERFORMANCE V3 JS START -->';
const JS_MARKER_END = '<!-- AGVN PERFORMANCE V3 JS END -->';

function readFile(file) {
  if (!fs.existsSync(file)) {
    throw new Error(`Không tìm thấy file: ${path.relative(ROOT, file)}`);
  }
  return fs.readFileSync(file, 'utf8');
}

function writeFile(file, content) {
  fs.writeFileSync(file, content, 'utf8');
}

function getAttr(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match ? match[2] : '';
}

function decodeHtml(value) {
  return String(value || '')
    .replace(/&amp;/gi, '&')
    .replace(/&#38;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function extractYoutubeId(url) {
  const decoded = decodeHtml(url);

  const patterns = [
    /youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{6,})/i,
    /youtube\.com\/watch\?(?:[^#]*&)?v=([A-Za-z0-9_-]{6,})/i,
    /youtu\.be\/([A-Za-z0-9_-]{6,})/i,
    /[?&]v=([A-Za-z0-9_-]{6,})/i
  ];

  for (const pattern of patterns) {
    const match = decoded.match(pattern);
    if (match) return match[1];
  }
  return '';
}

function removePreviousPatch(html) {
  const cssBlock = new RegExp(
    `${escapeRegExp(CSS_MARKER_START)}[\\s\\S]*?${escapeRegExp(CSS_MARKER_END)}\\s*`,
    'gi'
  );
  const jsBlock = new RegExp(
    `${escapeRegExp(JS_MARKER_START)}[\\s\\S]*?${escapeRegExp(JS_MARKER_END)}\\s*`,
    'gi'
  );

  return html.replace(cssBlock, '').replace(jsBlock, '');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function removeExternalAos(html) {
  // CSS AOS.
  html = html.replace(
    /<link\b[^>]*href=(["'])[^"']*(?:unpkg\.com\/aos|cdnjs\.cloudflare\.com\/ajax\/libs\/aos)[^"']*\1[^>]*>\s*/gi,
    ''
  );

  // JS AOS.
  html = html.replace(
    /<script\b[^>]*src=(["'])[^"']*(?:unpkg\.com\/aos|cdnjs\.cloudflare\.com\/ajax\/libs\/aos)[^"']*\1[^>]*>\s*<\/script>\s*/gi,
    ''
  );

  // Các lời gọi AOS.init phổ biến.
  html = html.replace(
    /\bAOS\.init\s*\(\s*(?:\{[\s\S]*?\})?\s*\)\s*;?/gi,
    ''
  );

  // data-aos, data-aos-delay, data-aos-duration, data-aos-once...
  html = html.replace(
    /\sdata-aos(?:-[a-z0-9_-]+)?\s*=\s*(["']).*?\1/gi,
    ''
  );

  return html;
}

function removeFontAwesome(html) {
  return html.replace(
    /<link\b[^>]*href=(["'])[^"']*(?:font-awesome|fontawesome)[^"']*\1[^>]*>\s*/gi,
    ''
  );
}

function buildLiteYoutube(iframeTag, fullMatch) {
  const src = getAttr(iframeTag, 'src') || getAttr(iframeTag, 'data-src');
  const videoId = extractYoutubeId(src);

  if (!videoId) {
    console.warn('⚠️ Tìm thấy iframe YouTube nhưng không đọc được video ID. Giữ nguyên iframe:', src);
    return fullMatch;
  }

  const title = getAttr(iframeTag, 'title') || 'Video thực tế từ khách hàng AGVN';

  return `<div class="agvn-lite-youtube" data-video-id="${videoId}">
  <button class="agvn-lite-youtube__button" type="button"
          aria-label="Phát ${escapeHtmlAttr(title)}">
    <img class="agvn-lite-youtube__thumbnail"
         src="https://i.ytimg.com/vi_webp/${videoId}/hqdefault.webp"
         width="480" height="360"
         loading="lazy" decoding="async" fetchpriority="low"
         alt="${escapeHtmlAttr(title)}"
         onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${videoId}/hqdefault.jpg';">
    <span class="agvn-lite-youtube__shade" aria-hidden="true"></span>
    <span class="agvn-lite-youtube__play" aria-hidden="true">▶</span>
    <span class="agvn-lite-youtube__label">Bấm để xem video</span>
  </button>
  <noscript>
    <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener">
      Xem video trên YouTube
    </a>
  </noscript>
</div>`;
}

function escapeHtmlAttr(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function replaceYoutubeIframes(html) {
  let replacements = 0;

  // Chỉ thay iframe có URL YouTube trong thẻ mở.
  html = html.replace(
    /(<iframe\b[^>]*(?:youtube(?:-nocookie)?\.com|youtu\.be)[^>]*>)[\s\S]*?<\/iframe>/gi,
    (fullMatch, iframeTag) => {
      const replacement = buildLiteYoutube(iframeTag, fullMatch);
      if (replacement !== fullMatch) replacements += 1;
      return replacement;
    }
  );

  console.log(`YouTube iframe đã chuyển sang lite embed: ${replacements}`);
  return html;
}

function injectCss(html) {
  const css = `${CSS_MARKER_START}
<style id="agvn-performance-v3-css">
/* ---------- Font Awesome replacement: icon CSS cực nhẹ ---------- */
.fa, .fas, .far, .fab, .fa-solid, .fa-regular, .fa-brands {
  font-family: inherit !important;
  font-style: normal !important;
  font-weight: 700;
  speak: never;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1em;
  line-height: 1;
}
.fa::before, .fas::before, .far::before, .fab::before,
.fa-solid::before, .fa-regular::before, .fa-brands::before { content: "•"; }

.fa-bars::before { content: "☰"; }
.fa-xmark::before, .fa-times::before { content: "×"; }
.fa-chevron-down::before { content: "⌄"; }
.fa-chevron-up::before { content: "⌃"; }
.fa-chevron-left::before { content: "‹"; font-size: 1.5em; }
.fa-chevron-right::before { content: "›"; font-size: 1.5em; }
.fa-arrow-left::before { content: "←"; }
.fa-arrow-right::before { content: "→"; }
.fa-arrow-up::before { content: "↑"; }
.fa-arrow-down::before { content: "↓"; }
.fa-phone::before, .fa-phone-alt::before, .fa-phone-volume::before { content: "☎"; }
.fa-envelope::before { content: "✉"; }
.fa-location-dot::before, .fa-map-marker-alt::before, .fa-map-pin::before { content: "⌖"; }
.fa-globe::before, .fa-earth-asia::before { content: "◎"; }
.fa-home::before, .fa-house::before { content: "⌂"; }
.fa-building::before { content: "▦"; }
.fa-seedling::before, .fa-leaf::before { content: "♧"; }
.fa-wheat-awn::before { content: "≋"; }
.fa-bug::before { content: "✦"; }
.fa-flask::before { content: "⚗"; }
.fa-microscope::before { content: "⌕"; }
.fa-shield-alt::before, .fa-shield-halved::before { content: "◆"; }
.fa-chart-line::before { content: "↗"; }
.fa-check::before, .fa-check-circle::before, .fa-circle-check::before { content: "✓"; }
.fa-info::before, .fa-info-circle::before, .fa-circle-info::before { content: "i"; }
.fa-clock::before { content: "◷"; }
.fa-calendar::before, .fa-calendar-days::before { content: "□"; }
.fa-user::before { content: "●"; font-size: .72em; }
.fa-tag::before { content: "#"; }
.fa-newspaper::before { content: "▤"; }
.fa-box::before, .fa-box-open::before { content: "□"; }
.fa-bottle-droplet::before { content: "◈"; }
.fa-play::before, .fa-circle-play::before, .fa-youtube::before { content: "▶"; }
.fa-facebook::before, .fa-facebook-f::before { content: "f"; font-family: Arial, sans-serif !important; }
.fa-facebook-messenger::before { content: "m"; font-family: Arial, sans-serif !important; }
.fa-expand::before { content: "⛶"; }

/* ---------- Lite YouTube ---------- */
.agvn-lite-youtube {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: inherit;
  background: #07170d;
  contain: layout paint style;
}
.agvn-lite-youtube__button {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  overflow: hidden;
  border: 0;
  color: #fff;
  background: #07170d;
  cursor: pointer;
}
.agvn-lite-youtube__thumbnail {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
.agvn-lite-youtube__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,.48));
}
.agvn-lite-youtube__play {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 72px;
  height: 52px;
  display: grid;
  place-items: center;
  padding-left: 4px;
  border-radius: 16px;
  color: #fff;
  background: #e62117;
  box-shadow: 0 12px 30px rgba(0,0,0,.32);
  font-size: 24px;
  transform: translate(-50%, -50%);
  transition: transform .2s ease, background .2s ease;
}
.agvn-lite-youtube__label {
  position: absolute;
  left: 50%;
  bottom: 18px;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(0,0,0,.68);
  font-size: .86rem;
  font-weight: 650;
  white-space: nowrap;
  transform: translateX(-50%);
}
.agvn-lite-youtube__button:hover .agvn-lite-youtube__play,
.agvn-lite-youtube__button:focus-visible .agvn-lite-youtube__play {
  background: #ff2a20;
  transform: translate(-50%, -50%) scale(1.07);
}
.agvn-lite-youtube__button:focus-visible {
  outline: 4px solid #f2b705;
  outline-offset: -4px;
}
.agvn-lite-youtube iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
@media (max-width: 600px) {
  .agvn-lite-youtube__play {
    width: 60px;
    height: 44px;
    border-radius: 13px;
    font-size: 20px;
  }
  .agvn-lite-youtube__label {
    bottom: 12px;
    font-size: .76rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .agvn-lite-youtube__play { transition: none; }
}
</style>
${CSS_MARKER_END}`;

  return html.replace(/<\/head>/i, `${css}\n</head>`);
}

function injectJs(html) {
  const js = `${JS_MARKER_START}
<script id="agvn-performance-v3-js">
(function () {
  "use strict";

  function activateLiteYoutube(wrapper) {
    if (!wrapper || wrapper.dataset.loaded === "true") return;

    var videoId = wrapper.getAttribute("data-video-id");
    if (!videoId) return;

    wrapper.dataset.loaded = "true";

    var iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube-nocookie.com/embed/" +
      encodeURIComponent(videoId) +
      "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
    iframe.title = "Video thực tế từ khách hàng AGVN";
    iframe.loading = "eager";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;

    wrapper.replaceChildren(iframe);
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest(".agvn-lite-youtube__button");
    if (!button) return;
    activateLiteYoutube(button.closest(".agvn-lite-youtube"));
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    var button = event.target.closest(".agvn-lite-youtube__button");
    if (!button) return;
    event.preventDefault();
    activateLiteYoutube(button.closest(".agvn-lite-youtube"));
  });
})();
</script>
${JS_MARKER_END}`;

  return html.replace(/<\/body>/i, `${js}\n</body>`);
}

function patchIndex(html) {
  html = removePreviousPatch(html);
  html = removeExternalAos(html);
  html = removeFontAwesome(html);
  html = replaceYoutubeIframes(html);
  html = injectCss(html);
  html = injectJs(html);
  return html;
}

function verify(html) {
  const problems = [];

  if (/font-awesome|fontawesome/i.test(html)) {
    problems.push('index.html vẫn còn tham chiếu Font Awesome.');
  }

  if (/(?:unpkg\.com\/aos|cdnjs\.cloudflare\.com\/ajax\/libs\/aos)/i.test(html)) {
    problems.push('index.html vẫn còn tham chiếu AOS.');
  }

  if (/<iframe\b[^>]*(?:youtube(?:-nocookie)?\.com|youtu\.be)/i.test(html)) {
    problems.push('index.html vẫn còn iframe YouTube tải ngay.');
  }

  if (!html.includes('agvn-performance-v3-css')) {
    problems.push('Thiếu CSS Performance v3.');
  }

  if (!html.includes('agvn-performance-v3-js')) {
    problems.push('Thiếu JavaScript Performance v3.');
  }

  if (problems.length) {
    throw new Error(problems.join('\n'));
  }
}

function main() {
  const before = readFile(INDEX_PATH);
  const after = patchIndex(before);
  verify(after);

  if (before === after) {
    console.log('Không có thay đổi. Patch v3 đã được áp dụng trước đó.');
    return;
  }

  writeFile(INDEX_PATH, after);

  const beforeSize = Buffer.byteLength(before);
  const afterSize = Buffer.byteLength(after);

  console.log('✅ Đã áp dụng AGVN Performance Patch v3.');
  console.log(`index.html: ${beforeSize} bytes → ${afterSize} bytes`);
  console.log('YouTube chỉ tải sau khi người dùng bấm phát.');
  console.log('AOS và Font Awesome đã được loại khỏi lần tải trang chủ.');
}

main();
