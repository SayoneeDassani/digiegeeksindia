import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const base = process.env.QA_BASE_URL || "http://localhost:3000";
const chromePath = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const output = path.resolve(".qa");
await mkdir(output, { recursive: true });
const profile = await mkdtemp(path.join(tmpdir(), "digigeeks-browser-"));
const chrome = spawn(chromePath, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank"], { windowsHide: true, stdio: ["ignore", "ignore", "pipe"] });
let socket;
const report = [];
const runtimeErrors = [];
try {
  const debuggerUrl = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Chrome did not start within 20 seconds.")), 20000);
    let stderr = "";
    chrome.once("error", reject);
    chrome.stderr.on("data", chunk => {
      stderr += chunk;
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) { clearTimeout(timer); resolve(match[1]); }
    });
  });
  socket = new WebSocket(debuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
  let id = 0;
  let session;
  const pending = new Map();
  const events = new Map();
  socket.addEventListener("message", message => {
    const data = JSON.parse(message.data);
    if (data.id && pending.has(data.id)) {
      const item = pending.get(data.id);
      clearTimeout(item.timer);
      pending.delete(data.id);
      if (data.error) item.reject(new Error(data.error.message)); else item.resolve(data.result);
    }
    if (data.method === "Runtime.exceptionThrown") runtimeErrors.push(data.params.exceptionDetails.text);
    if (events.has(data.method)) { events.get(data.method)(data.params); events.delete(data.method); }
  });
  function send(method, params = {}, attach = true) {
    return new Promise((resolve, reject) => {
      const current = ++id;
      const timer = setTimeout(() => { pending.delete(current); reject(new Error(`CDP timeout: ${method}`)); }, 20000);
      pending.set(current, { resolve, reject, timer });
      socket.send(JSON.stringify({ id: current, method, params, ...(attach && session ? { sessionId: session } : {}) }));
    });
  }
  async function evaluate(expression) {
    const data = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (data.exceptionDetails) throw new Error(data.exceptionDetails.text);
    return data.result.value;
  }
  async function until(expression, label) {
    for (let i = 0; i < 100; i++) {
      if (await evaluate(expression)) return;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error(`Timed out: ${label}`);
  }
  async function navigate(route) {
    const loaded = new Promise(resolve => events.set("Page.loadEventFired", resolve));
    await send("Page.navigate", { url: `${base}${route}` });
    await Promise.race([loaded, new Promise((_, reject) => setTimeout(() => reject(new Error(`Page load timeout: ${route}`)), 20000))]);
    await evaluate("document.fonts.ready.then(() => true)");
    // Allow hydration to attach client event handlers.
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  const { targetId } = await send("Target.createTarget", { url: "about:blank" }, false);
  session = (await send("Target.attachToTarget", { targetId, flatten: true }, false)).sessionId;
  await send("Page.enable");
  await send("Runtime.enable");
  for (const width of [360, 768, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: width < 760 ? 844 : 1000, deviceScaleFactor: 1, mobile: width < 760 });
    for (const route of ["/", "/about", "/services", "/our-work", "/contact", "/privacy-policy", "/terms"]) {
      await navigate(route);
      const metrics = await evaluate(`({ title: document.title, h1: document.querySelectorAll('h1').length, viewport: innerWidth, document: document.documentElement.scrollWidth, font: getComputedStyle(document.querySelector('h1')).fontFamily, overflow: [...document.querySelectorAll('main *')].filter(e => e.getBoundingClientRect().right > innerWidth + 2 && getComputedStyle(e).position !== 'absolute').slice(0,5).map(e=>e.className) })`);
      assert.equal(metrics.h1, 1, `${route} at ${width}: one H1`);
      assert.ok(metrics.document <= metrics.viewport + 1, `${route} at ${width}: horizontal overflow ${JSON.stringify(metrics)}`);
      report.push({ route, width, ...metrics });
      if (width === 360 || (width === 1440 && ["/", "/contact", "/about"].includes(route))) {
        const layout = await send("Page.getLayoutMetrics");
        const screenshot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: Math.min(layout.cssContentSize.height, 16000), scale: 1 } });
        await writeFile(path.join(output, `${route === "/" ? "home" : route.slice(1)}-${width}.png`), Buffer.from(screenshot.data, "base64"));
      }
      console.log(`PASS browser ${route} at ${width}px`);
    }
  }
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await navigate("/");
  assert.equal(await evaluate("getComputedStyle(document.querySelector('#main-navigation')).display"), "none");
  await evaluate("document.querySelector('.menu-toggle').click()");
  await until("document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'true'", "mobile menu opening");
  assert.notEqual(await evaluate("getComputedStyle(document.querySelector('#main-navigation')).display"), "none");
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await until("document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'false'", "Escape closing mobile menu");
  assert.equal(await evaluate("document.activeElement === document.querySelector('.menu-toggle')"), true);
  await evaluate("document.querySelector('.menu-toggle').click()");
  await until("document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'true'", "menu reopening");
  await evaluate("document.querySelector('#main-navigation a[href=\"/services\"]').click()");
  await until("location.pathname === '/services' && document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'false'", "mobile navigation and menu closure");
  console.log("PASS mobile menu toggle, Escape, focus return and navigation");

  await navigate("/contact?service=AI%20Solutions");
  await until("document.querySelector('#service')?.value === 'AI Solutions'", "service preselection");
  assert.equal(await evaluate("document.querySelector('form').textContent.includes('Development mode')"), true, "Never submit a test enquiry when real email is enabled.");
  await evaluate("document.querySelector('form').requestSubmit()");
  await until("document.querySelectorAll('.field-error').length >= 4", "required field validation");
  assert.equal(await evaluate("document.activeElement.id"), "name");
  await evaluate(`(() => { for (const [key,value] of Object.entries({ name:'Browser QA', email:'qa@example.com', description:'Local browser validation only.' })) document.getElementById(key).value = value; document.getElementById('consent').checked = true; document.querySelector('form').requestSubmit(); })()`);
  await until("document.querySelector('.form-status')?.textContent.includes('has not been sent or saved')", "disabled-delivery response");
  assert.equal(await evaluate("document.getElementById('description').value"), "Local browser validation only.");
  assert.equal(await evaluate("document.querySelector('button[type=submit]').disabled"), false);
  console.log("PASS service preselection, field errors, focus, development submission and text preservation");
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  assert.equal(await evaluate("getComputedStyle(document.documentElement).scrollBehavior"), "auto");
  assert.deepEqual(runtimeErrors, [], "No uncaught browser exceptions");
  await writeFile(path.join(output, "browser-report.json"), JSON.stringify({ report, runtimeErrors, interactions: "passed" }, null, 2));
  console.log(`PASS reduced motion and browser runtime; screenshots saved to ${output}`);
  await send("Browser.close", {}, false);
} finally {
  socket?.close();
  if (chrome.exitCode === null) chrome.kill();
  // Only remove the exact temporary profile created above, never project files.
  const resolved = path.resolve(profile);
  assert.ok(resolved.startsWith(path.resolve(tmpdir()) + path.sep) && path.basename(resolved).startsWith("digigeeks-browser-"));
  await new Promise(resolve => setTimeout(resolve, 700));
  await rm(resolved, { recursive: true, force: true, maxRetries: 4, retryDelay: 500 });
}
