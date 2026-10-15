// i18n structural parity check — en vs zh-TW dictionaries must have identical
// key structure (same leaf paths, same array lengths, same item keys).
// Run with: bun tests/i18n-parity.mjs
import { en } from "../src/i18n/en.ts";
import { zhTW } from "../src/i18n/zh-TW.ts";

function paths(obj, prefix = "") {
  const out = [];
  if (Array.isArray(obj)) {
    out.push(`${prefix}[] len=${obj.length}`);
    if (obj.length > 0 && typeof obj[0] === "object" && obj[0] !== null) {
      out.push(...paths(obj[0], `${prefix}[0]`));
    }
  } else if (typeof obj === "object" && obj !== null) {
    for (const [k, v] of Object.entries(obj)) {
      out.push(...paths(v, prefix ? `${prefix}.${k}` : k));
    }
  } else {
    out.push(prefix);
  }
  return out;
}

const enPaths = new Set(paths(en));
const twPaths = new Set(paths(zhTW));
const missingInTW = [...enPaths].filter((p) => !twPaths.has(p));
const extraInTW = [...twPaths].filter((p) => !enPaths.has(p));

// sanity: every URL-ish string in zh-TW must be an https:// link or empty
const badUrls = [];
function walk(obj, prefix = "") {
  if (typeof obj === "string") {
    if (/^(https?:)?\/\//i.test(obj) && !obj.startsWith("https://")) {
      badUrls.push(`${prefix}: ${obj}`);
    }
  } else if (Array.isArray(obj)) obj.forEach((v, i) => walk(v, `${prefix}[${i}]`));
  else if (typeof obj === "object" && obj !== null)
    Object.entries(obj).forEach(([k, v]) => walk(v, prefix ? `${prefix}.${k}` : k));
}
walk(zhTW);

if (missingInTW.length || extraInTW.length || badUrls.length) {
  console.error("I18N PARITY FAILURES");
  missingInTW.forEach((p) => console.error(`  missing in zh-TW: ${p}`));
  extraInTW.forEach((p) => console.error(`  extra in zh-TW: ${p}`));
  badUrls.forEach((p) => console.error(`  non-https url: ${p}`));
  process.exit(1);
}
console.log(`i18n parity OK — ${enPaths.size} structural paths match, all URLs https.`);
