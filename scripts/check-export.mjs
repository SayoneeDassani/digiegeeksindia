import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const output = path.resolve("out");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const origin = "https://export-check.invalid";
const read = file => readFileSync(file, "utf8");
const pages = new Map();
const assets = new Set();

function resolveLocal(href, from) {
  const url = new URL(href.replaceAll("&amp;", "&"), `${origin}${from}`);
  if (url.origin !== origin) return null;
  assert.ok(!basePath || url.pathname === basePath || url.pathname.startsWith(`${basePath}/`), `Missing repository prefix: ${href} in ${from}`);
  const relative = decodeURIComponent(url.pathname.slice(basePath.length)).replace(/^\//, "");
  let file = path.join(output, relative);
  if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, "index.html");
  assert.ok(existsSync(file), `Missing exported target: ${href} in ${from}`);
  if (url.hash) {
    const html = read(file);
    assert.ok(html.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Missing anchor: ${href} in ${from}`);
  }
  assets.add(file);
  return { file, pathname: url.pathname };
}

for (const route of ["/", "/about/", "/services/", "/our-work/", "/privacy-policy/", "/terms/", "/contact/"]) {
  const file = path.join(output, route, "index.html");
  const html = read(file);
  pages.set(route, html);
  if (route !== "/contact/") {
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${route}: one H1`);
    assert.match(html, /<meta name="description" content="[^"]+"/, `${route}: description`);
  }
  const from = `${basePath}${route}`;
  for (const match of html.matchAll(/<(?:a|link|script|img)\b[^>]*\b(?:href|src)="([^"]+)"/g)) {
    resolveLocal(match[1], from);
  }
}

for (const file of [...assets].filter(file => file.endsWith(".css"))) {
  const pathname = `${basePath}/${path.relative(output, file).split(path.sep).join("/")}`;
  for (const match of read(file).matchAll(/url\(["']?([^"'()\s]+)["']?\)/g)) {
    resolveLocal(match[1], pathname);
  }
}

assert.ok(pages.get("/").includes('id="contact"'), "Homepage contact section");
for (const href of ["mailto:sam@digigeeks.co.uk", "tel:+919883069111", "tel:+447552550062"]) {
  assert.ok(pages.get("/").includes(href), `Homepage contact link: ${href}`);
}
assert.ok(pages.get("/contact/").includes(`${basePath}/#contact`), "Legacy contact page points to homepage");
assert.ok(existsSync(path.join(output, "images/founder.jpeg")), "Founder image");
for (const file of ["404.html", "robots.txt", "sitemap.xml"]) assert.ok(existsSync(path.join(output, file)), file);
assert.ok(!existsSync(path.join(output, "api/contact")), "No server-only contact endpoint");
assert.ok(readdirSync(path.join(output, "_next/static/media")).some(file => file.startsWith("conference_speech")), "Conference image");
console.log(`PASS ${pages.size} exported pages, contact links, anchors and ${assets.size} local assets under ${basePath || "/"}`);
