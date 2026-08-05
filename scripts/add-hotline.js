const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OLD_PHONE_RAW = '0869980098';
const OLD_PHONE_DISPLAY = '0869 980 098';
const NEW_PHONE_RAW = '0969882442';
const NEW_PHONE_DISPLAY = '0969 882 442';

const SKIP_DIRS = new Set(['.git', 'node_modules']);

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(fullPath));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) files.push(fullPath);
  }
  return files;
}

function hasNewFooterPhone(html) {
  return new RegExp(`<li>\\s*<a[^>]*href=["']tel:${NEW_PHONE_RAW}["']`, 'i').test(html);
}

function hasNewFloatingPhone(html) {
  return new RegExp(`<a\\b(?=[^>]*class=["'][^"']*\\bfloat-phone\\b[^"']*["'])(?=[^>]*href=["']tel:${NEW_PHONE_RAW}["'])`, 'i').test(html);
}


function hasNewCtaPhone(html) {
  return new RegExp(`<a\\b(?=[^>]*class=["'][^"']*\\bcta-btn-phone\\b[^"']*["'])(?=[^>]*href=["']tel:${NEW_PHONE_RAW}["'])`, 'i').test(html);
}

function addCtaPhone(html) {
  if (hasNewCtaPhone(html)) return html;

  const oldCtaPhone = new RegExp(
    `(<a\\b(?=[^>]*class=["'][^"']*\\bcta-btn-phone\\b[^"']*["'])(?=[^>]*href=["']tel:${OLD_PHONE_RAW}["'])[^>]*>[\\s\\S]*?<\\/a>)`,
    'i'
  );

  if (!oldCtaPhone.test(html)) return html;

  return html.replace(oldCtaPhone, (match) => {
    const clone = match
      .replaceAll(`tel:${OLD_PHONE_RAW}`, `tel:${NEW_PHONE_RAW}`)
      .replaceAll(OLD_PHONE_DISPLAY, NEW_PHONE_DISPLAY)
      .replace(/Gọi Tổng Đài:/gi, 'Gọi Hotline 2:');
    return `${match}\n                            ${clone}`;
  });
}

function addFooterPhone(html) {
  if (hasNewFooterPhone(html)) return html;

  const oldPhoneItem = new RegExp(
    `(<li>\\s*<a[^>]*href=["']tel:${OLD_PHONE_RAW}["'][^>]*>[\\s\\S]*?<\\/a>\\s*<\\/li>)`,
    'i'
  );

  const newPhoneItem = `\n          <li><a href="tel:${NEW_PHONE_RAW}"><i class="fa-solid fa-phone"></i><span>${NEW_PHONE_DISPLAY}</span></a></li>`;

  if (oldPhoneItem.test(html)) {
    return html.replace(oldPhoneItem, `$1${newPhoneItem}`);
  }

  // Fallback: insert the new hotline just before the AGVN email in the contact list.
  const emailItem = /(<li>\s*<a[^>]*href=["']mailto:agvngroup2025@gmail\.com["'][^>]*>[\s\S]*?<\/a>\s*<\/li>)/i;
  if (emailItem.test(html)) {
    return html.replace(emailItem, `${newPhoneItem.trim()}\n          $1`);
  }

  return html;
}

function addFloatingPhone(html) {
  if (hasNewFloatingPhone(html)) return html;

  const oldFloatingPhone = new RegExp(
    `(<a\\b(?=[^>]*class=["'][^"']*\\bfloat-btn\\b[^"']*\\bfloat-phone\\b[^"']*["'])(?=[^>]*href=["']tel:${OLD_PHONE_RAW}["'])[^>]*>[\\s\\S]*?<\\/a>)`,
    'i'
  );

  const newFloatingPhone = `\n  <a class="float-btn float-phone float-phone-secondary" href="tel:${NEW_PHONE_RAW}" aria-label="Gọi AGVN Group: ${NEW_PHONE_DISPLAY}" title="Gọi ${NEW_PHONE_DISPLAY}"><i class="fa-solid fa-phone"></i></a>`;

  if (oldFloatingPhone.test(html)) {
    return html.replace(oldFloatingPhone, `$1${newFloatingPhone}`);
  }

  return html;
}

function patchHtml(html) {
  let output = html;
  output = addFooterPhone(output);
  output = addCtaPhone(output);
  output = addFloatingPhone(output);
  return output;
}

const files = walk(ROOT);
let changed = 0;
let alreadyUpdated = 0;
let noContactMarkup = 0;
let needsReview = 0;

for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  const after = patchHtml(before);
  const relative = path.relative(ROOT, file);

  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changed += 1;
    console.log(`UPDATED ${relative}`);
  } else if (before.includes(NEW_PHONE_RAW)) {
    alreadyUpdated += 1;
  } else if (before.includes(OLD_PHONE_RAW)) {
    needsReview += 1;
    console.warn(`CHECK ${relative}: found old phone but contact markup did not match.`);
  } else {
    noContactMarkup += 1;
  }
}

console.log(`\nHotline update complete.`);
console.log(`HTML files scanned: ${files.length}`);
console.log(`Files changed: ${changed}`);
console.log(`Already updated: ${alreadyUpdated}`);
console.log(`Need manual review: ${needsReview}`);
console.log(`No AGVN contact markup: ${noContactMarkup}`);
console.log(`Kept existing hotline: ${OLD_PHONE_DISPLAY}`);
console.log(`Added hotline: ${NEW_PHONE_DISPLAY}`);
console.log(`Zalo remains unchanged on ${OLD_PHONE_DISPLAY}.`);
