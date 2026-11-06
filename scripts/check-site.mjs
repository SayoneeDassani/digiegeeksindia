import assert from "node:assert/strict";

const base = process.env.QA_BASE_URL || "http://localhost:3000";
const routes = ["/", "/about", "/services", "/our-work", "/contact", "/privacy-policy", "/terms"];
const pages = new Map();
const titles = new Set();
const descriptions = new Set();
for (const route of routes) {
  const response = await fetch(`${base}${route}`);
  assert.equal(response.status, 200, `${route}: status`);
  const html = await response.text();
  pages.set(route, html);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${route}: one H1`);
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert.ok(title && !titles.has(title), `${route}: unique title`);
  assert.ok(description && !descriptions.has(description), `${route}: unique description`);
  titles.add(title);
  descriptions.add(description);
  assert.match(html, /name="robots" content="noindex, nofollow"/, `${route}: development indexing guard`);
  assert.doesNotMatch(html, /rel="canonical"/, `${route}: no development canonical`);
  assert.match(html, /property="og:image"/, `${route}: social image`);
  console.log(`PASS ${route}: metadata, single H1, and development SEO`);
}
const checked = new Set();
for (const [route, html] of pages) {
  for (const match of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
    const href = match[1].replaceAll("&amp;", "&");
    const url = new URL(href, `${base}${route}`);
    if (url.origin !== new URL(base).origin) continue;
    assert.ok(pages.has(url.pathname), `${route}: internal route ${href}`);
    if (url.hash) {
      const id = decodeURIComponent(url.hash.slice(1));
      assert.ok(pages.get(url.pathname).includes(`id="${id}"`), `${route}: anchor ${href}`);
    }
    checked.add(href);
  }
}
console.log(`PASS ${checked.size} distinct internal navigation, CTA, query and anchor links`);
assert.equal((await fetch(`${base}/this-page-does-not-exist`)).status, 404);
assert.match(await (await fetch(`${base}/robots.txt`)).text(), /Disallow: \//);
assert.doesNotMatch(await (await fetch(`${base}/sitemap.xml`)).text(), /<loc>/);
assert.equal((await fetch(`${base}/images/social-card.png`)).status, 200);
assert.equal((await fetch(`${base}/favicon.ico`)).status, 200);
console.log("PASS 404, robots, sitemap, social image and favicon");

const endpoint = `${base}/api/contact`;
const post = async (data, status, origin = base, contentType = "application/json") => {
  const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": contentType, Origin: origin }, body: typeof data === "string" ? data : JSON.stringify(data) });
  assert.equal(response.status, status);
  return response.json();
};
const invalid = await post({}, 400);
for (const field of ["name", "email", "description", "consent"]) assert.ok(invalid.errors[field]);
const sample = { name: "Local QA", email: "qa@example.com", description: "Local form verification only.", service: "AI Solutions", consent: true, website: "" };
assert.ok((await post({ ...sample, consent: "true" }, 400)).errors.consent);
assert.ok((await post({ ...sample, service: "Unknown service" }, 400)).errors.service);
assert.ok((await post({ ...sample, website: "spam" }, 400)).errors.website);
assert.ok((await post({ ...sample, email: "invalid" }, 400)).errors.email);
assert.ok((await post({ ...sample, name: "A".repeat(101) }, 400)).errors.name);
assert.ok((await post({ ...sample, description: "A".repeat(5001) }, 400)).errors.description);
assert.ok((await post({ ...sample, name: "Header\nInjection" }, 400)).errors.name);
await post(sample, 403, "https://unrelated.example");
await post(sample, 415, base, "text/plain");
await post("{broken-json", 400);
await post("A".repeat(25000), 413);
// Never send a real email in this automated check.
assert.match(pages.get("/contact"), /Development mode/);
const development = await post(sample, 503);
assert.equal(development.status, "development");
assert.match(development.message, /not been sent or saved/);
console.log("PASS server validation, origin/content/body guards and honest disabled-delivery response");
