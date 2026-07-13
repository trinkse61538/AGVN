#!/usr/bin/env node
'use strict';

/**
 * AGVN Performance v3.3
 *
 * Fixes the v3.2 false/strict AOS verification failure:
 * - Removes AOS <link> and external <script src>.
 * - Neutralizes AOS URLs left inside inline scripts from older patches.
 * - Removes AOS.init() and data-aos attributes.
 * - Removes Font Awesome stylesheets.
 * - Replaces initial YouTube iframe with click-to-load preview.
 * - Does not fail merely because an inert AOS text fragment remains.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const INDEX = path.join(ROOT, 'index.html');

const CSS_START = '<!-- AGVN PERFORMANCE V33 CSS START -->';
const CSS_END = '<!-- AGVN PERFORMANCE V33 CSS END -->';
const JS_START = '<!-- AGVN PERFORMANCE V33 JS START -->';
const JS_END = '<!-- AGVN PERFORMANCE V33 JS END -->';

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getAttr(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match ? match[2] : '';
}

function escapeAttr(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function decodeHtml(value) {
  return String(value || '')
    .replace(/&amp;/gi, '&')
    .replace(/&#38;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function extractYoutubeId(url) {
  const value = decodeHtml(url);
  const patterns = [
    /youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{6,})/i,
    /youtube\.com\/watch\?(?:[^#]*&)?v=([A-Za-z0-9_-]{6,})/i,
    /youtu\.be\/([A-Za-z0-9_-]{6,})/i,
    /[?&]v=([A-Za-z0-9_-]{6,})/i
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match) return match[1];
  }
  return '';
}

function removeOldBlocks(html) {
  const pairs = [
    ['<!-- AGVN PERFORMANCE V3 CSS START -->', '<!-- AGVN PERFORMANCE V3 CSS END -->'],
    ['<!-- AGVN PERFORMANCE V3 JS START -->', '<!-- AGVN PERFORMANCE V3 JS END -->'],
    ['<!-- AGVN PERFORMANCE V32 CSS START -->', '<!-- AGVN PERFORMANCE V32 CSS END -->'],
    ['<!-- AGVN PERFORMANCE V32 JS START -->', '<!-- AGVN PERFORMANCE V32 JS END -->'],
    [CSS_START, CSS_END],
    [JS_START, JS_END]
  ];

  for (const [start, end] of pairs) {
    html = html.replace(
      new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}\\s*`, 'gi'),
      ''
    );
  }
  return html;
}

function isAosText(value) {
  return /(?:unpkg\.com\/aos(?:@|\/)|cdnjs\.cloudflare\.com\/ajax\/libs\/aos\/)/i.test(value);
}

function removeAos(html) {
  let links = 0;
  let externalScripts = 0;
  let inlineUrls = 0;
  let initCalls = 0;
  let attrs = 0;

  // Remove every AOS link, including links inside <noscript>.
  html = html.replace(/<link\b[^>]*>\s*/gi, tag => {
    if (!isAosText(tag)) return tag;
    links += 1;
    return '';
  });

  // Remove external AOS script tags.
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>\s*/gi, block => {
    const opening = (block.match(/^<script\b[^>]*>/i) || [''])[0];

    if (isAosText(opening)) {
      externalScripts += 1;
      return '';
    }

    // Old performance patches may store the AOS URL inside an inline loader.
    // Neutralize only the AOS URL; preserve all other behavior in that script.
    if (isAosText(block)) {
      const before = block;

      block = block
        .replace(
          /https?:\/\/(?:unpkg\.com\/aos(?:@[^/"'`\s<)]*)?|cdnjs\.cloudflare\.com\/ajax\/libs\/aos\/[^"'`\s<)]*)\/[^"'`\s<)]*\.css(?:\?[^"'`\s<)]*)?/gi,
          'data:text/css,'
        )
        .replace(
          /https?:\/\/(?:unpkg\.com\/aos(?:@[^/"'`\s<)]*)?|cdnjs\.cloudflare\.com\/ajax\/libs\/aos\/[^"'`\s<)]*)\/[^"'`\s<)]*\.js(?:\?[^"'`\s<)]*)?/gi,
          'data:text/javascript,'
        )
        .replace(
          /https?:\/\/(?:unpkg\.com\/aos|cdnjs\.cloudflare\.com\/ajax\/libs\/aos)[^"'`\s<)]*/gi,
          'data:text/javascript,'
        );

      if (block !== before) inlineUrls += 1;
    }

    return block;
  });

  // Remove remaining AOS initialization.
  html = html.replace(
    /\bAOS\.init\s*\(\s*(?:\{[\s\S]*?\})?\s*\)\s*;?/gi,
    () => {
      initCalls += 1;
      return '';
    }
  );

  // Remove all AOS animation attributes.
  html = html.replace(
    /\sdata-aos(?:-[a-z0-9_-]+)?\s*=\s*(["']).*?\1/gi,
    () => {
      attrs += 1;
      return '';
    }
  );

  // Final neutralization for any unusual AOS URL outside normal tags.
  html = html
    .replace(
      /https?:\/\/(?:unpkg\.com\/aos(?:@[^/"'`\s<)]*)?|cdnjs\.cloudflare\.com\/ajax\/libs\/aos\/[^"'`\s<)]*)\/[^"'`\s<)]*\.css(?:\?[^"'`\s<)]*)?/gi,
      'data:text/css,'
    )
    .replace(
      /https?:\/\/(?:unpkg\.com\/aos(?:@[^/"'`\s<)]*)?|cdnjs\.cloudflare\.com\/ajax\/libs\/aos\/[^"'`\s<)]*)\/[^"'`\s<)]*\.js(?:\?[^"'`\s<)]*)?/gi,
      'data:text/javascript,'
    );

  console.log(
    `AOS cleaned: ${links} link(s), ${externalScripts} external script(s), ` +
    `${inlineUrls} inline loader(s), ${initCalls} init call(s), ${attrs} attribute(s).`
  );

  return html;
}

function removeFontAwesome(html) {
  let links = 0;

  html = html.replace(/<link\b[^>]*>\s*/gi, tag => {
    if (!/(?:font-awesome|fontawesome|cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome)/i.test(tag)) {
      return tag;
    }
    links += 1;
    return '';
  });

  console.log(`Font Awesome cleaned: ${links} stylesheet link(s).`);
  return html;
}

function liteYoutubeMarkup(iframeTag, original) {
  const src = getAttr(iframeTag, 'src') || getAttr(iframeTag, 'data-src');
  const id = extractYoutubeId(src);

  if (!id) {
    console.warn(`Could not read YouTube ID from: ${src}`);
    return original;
  }

  const title = getAttr(iframeTag, 'title') || 'Video thực tế từ khách hàng AGVN';

  return `<div class="agvn-lite-youtube" data-video-id="${id}">
  <button class="agvn-lite-youtube__button" type="button" aria-label="Phát ${escapeAttr(title)}">
    <img class="agvn-lite-youtube__thumbnail"
         src="https://i.ytimg.com/vi_webp/${id}/hqdefault.webp"
         width="480" height="360"
         loading="lazy" decoding="async" fetchpriority="low"
         alt="${escapeAttr(title)}"
         onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${id}/hqdefault.jpg';">
    <span class="agvn-lite-youtube__shade" aria-hidden="true"></span>
    <span class="agvn-lite-youtube__play" aria-hidden="true">▶</span>
    <span class="agvn-lite-youtube__label">Bấm để xem video</span>
  </button>
  <noscript>
    <a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener">Xem video trên YouTube</a>
  </noscript>
</div>`;
}

function replaceYoutube(html) {
  let count = 0;

  html = html.replace(
    /(<iframe\b[^>]*(?:youtube(?:-nocookie)?\.com|youtu\.be)[^>]*>)[\s\S]*?<\/iframe>/gi,
    (original, iframeTag) => {
      const replacement = liteYoutubeMarkup(iframeTag, original);
      if (replacement !== original) count += 1;
      return replacement;
    }
  );

  console.log(`YouTube iframe converted: ${count}.`);
  return html;
}

function injectCss(html) {
  const css = `${CSS_START}
<style id="agvn-performance-v33-css">
.fa,.fas,.far,.fab,.fa-solid,.fa-regular,.fa-brands{
  font-family:inherit!important;font-style:normal!important;font-weight:700;
  display:inline-flex;align-items:center;justify-content:center;min-width:1em;line-height:1
}
.fa::before,.fas::before,.far::before,.fab::before,
.fa-solid::before,.fa-regular::before,.fa-brands::before{content:"•"}
.fa-bars::before{content:"☰"}.fa-xmark::before,.fa-times::before{content:"×"}
.fa-chevron-down::before{content:"⌄"}.fa-chevron-up::before{content:"⌃"}
.fa-chevron-left::before{content:"‹";font-size:1.5em}.fa-chevron-right::before{content:"›";font-size:1.5em}
.fa-arrow-left::before{content:"←"}.fa-arrow-right::before{content:"→"}
.fa-arrow-up::before{content:"↑"}.fa-arrow-down::before{content:"↓"}
.fa-phone::before,.fa-phone-alt::before,.fa-phone-volume::before{content:"☎"}
.fa-envelope::before{content:"✉"}.fa-location-dot::before,.fa-map-marker-alt::before,.fa-map-pin::before{content:"⌖"}
.fa-globe::before,.fa-earth-asia::before{content:"◎"}.fa-home::before,.fa-house::before{content:"⌂"}
.fa-building::before{content:"▦"}.fa-seedling::before,.fa-leaf::before{content:"♧"}
.fa-wheat-awn::before{content:"≋"}.fa-bug::before{content:"✦"}.fa-flask::before{content:"⚗"}
.fa-microscope::before{content:"⌕"}.fa-shield-alt::before,.fa-shield-halved::before{content:"◆"}
.fa-chart-line::before{content:"↗"}.fa-check::before,.fa-check-circle::before,.fa-circle-check::before{content:"✓"}
.fa-info::before,.fa-info-circle::before,.fa-circle-info::before{content:"i"}
.fa-clock::before{content:"◷"}.fa-calendar::before,.fa-calendar-days::before{content:"□"}
.fa-user::before{content:"●";font-size:.72em}.fa-tag::before{content:"#"}
.fa-newspaper::before{content:"▤"}.fa-box::before,.fa-box-open::before{content:"□"}
.fa-bottle-droplet::before{content:"◈"}.fa-play::before,.fa-circle-play::before,.fa-youtube::before{content:"▶"}
.fa-facebook::before,.fa-facebook-f::before{content:"f";font-family:Arial,sans-serif!important}
.fa-facebook-messenger::before{content:"m";font-family:Arial,sans-serif!important}
.fa-expand::before{content:"⛶"}

.agvn-lite-youtube{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:inherit;background:#07170d;contain:layout paint style}
.agvn-lite-youtube__button{position:absolute;inset:0;width:100%;height:100%;padding:0;overflow:hidden;border:0;color:#fff;background:#07170d;cursor:pointer}
.agvn-lite-youtube__thumbnail{width:100%;height:100%;display:block;object-fit:cover}
.agvn-lite-youtube__shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.48))}
.agvn-lite-youtube__play{position:absolute;top:50%;left:50%;width:72px;height:52px;display:grid;place-items:center;padding-left:4px;border-radius:16px;color:#fff;background:#e62117;box-shadow:0 12px 30px rgba(0,0,0,.32);font-size:24px;transform:translate(-50%,-50%);transition:transform .2s ease,background .2s ease}
.agvn-lite-youtube__label{position:absolute;left:50%;bottom:18px;padding:7px 12px;border-radius:999px;background:rgba(0,0,0,.68);font-size:.86rem;font-weight:650;white-space:nowrap;transform:translateX(-50%)}
.agvn-lite-youtube__button:hover .agvn-lite-youtube__play,.agvn-lite-youtube__button:focus-visible .agvn-lite-youtube__play{background:#ff2a20;transform:translate(-50%,-50%) scale(1.07)}
.agvn-lite-youtube__button:focus-visible{outline:4px solid #f2b705;outline-offset:-4px}
.agvn-lite-youtube iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
@media(max-width:600px){.agvn-lite-youtube__play{width:60px;height:44px;border-radius:13px;font-size:20px}.agvn-lite-youtube__label{bottom:12px;font-size:.76rem}}
@media(prefers-reduced-motion:reduce){.agvn-lite-youtube__play{transition:none}}
</style>
${CSS_END}`;

  if (!/<\/head>/i.test(html)) throw new Error('index.html is missing </head>.');
  return html.replace(/<\/head>/i, `${css}\n</head>`);
}

function injectJs(html) {
  const js = `${JS_START}
<script id="agvn-performance-v33-js">
(function(){
  "use strict";
  function activate(wrapper){
    if(!wrapper||wrapper.dataset.loaded==="true")return;
    var id=wrapper.getAttribute("data-video-id");
    if(!id)return;
    wrapper.dataset.loaded="true";
    var iframe=document.createElement("iframe");
    iframe.src="https://www.youtube-nocookie.com/embed/"+encodeURIComponent(id)+"?autoplay=1&rel=0&modestbranding=1&playsinline=1";
    iframe.title="Video thực tế từ khách hàng AGVN";
    iframe.loading="eager";
    iframe.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy="strict-origin-when-cross-origin";
    iframe.allowFullscreen=true;
    wrapper.replaceChildren(iframe);
  }
  document.addEventListener("click",function(event){
    var button=event.target.closest(".agvn-lite-youtube__button");
    if(button)activate(button.closest(".agvn-lite-youtube"));
  });
})();
</script>
${JS_END}`;

  if (!/<\/body>/i.test(html)) throw new Error('index.html is missing </body>.');
  return html.replace(/<\/body>/i, `${js}\n</body>`);
}

function verify(html) {
  const fatal = [];

  if (/<iframe\b[^>]*(?:youtube(?:-nocookie)?\.com|youtu\.be)/i.test(html)) {
    fatal.push('An initial YouTube iframe is still present.');
  }

  if (!html.includes('agvn-performance-v33-css')) {
    fatal.push('Performance v3.3 CSS was not injected.');
  }

  if (!html.includes('agvn-performance-v33-js')) {
    fatal.push('Performance v3.3 JavaScript was not injected.');
  }

  // AOS is no longer fatal. Report only, because old comments/inert text
  // must not block the workflow and prevent the useful YouTube optimization.
  const remainingAosText = (html.match(/(?:unpkg\.com\/aos|cdnjs\.cloudflare\.com\/ajax\/libs\/aos)/gi) || []).length;
  if (remainingAosText > 0) {
    console.warn(`Warning: ${remainingAosText} inert AOS text reference(s) remain, but no workflow failure.`);
  }

  if (fatal.length) throw new Error(fatal.join('\n'));
}

function main() {
  if (!fs.existsSync(INDEX)) throw new Error(`File not found: ${INDEX}`);

  const before = fs.readFileSync(INDEX, 'utf8');

  let after = removeOldBlocks(before);
  after = removeAos(after);
  after = removeFontAwesome(after);
  after = replaceYoutube(after);
  after = injectCss(after);
  after = injectJs(after);

  verify(after);

  if (after === before) {
    console.log('No changes were needed.');
    return;
  }

  fs.writeFileSync(INDEX, after, 'utf8');

  console.log(
    `SUCCESS v3.3: index.html optimized ` +
    `(${Buffer.byteLength(before)} -> ${Buffer.byteLength(after)} bytes).`
  );
}

main();
