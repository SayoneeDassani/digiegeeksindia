"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { serviceOptions } from "@/lib/services";
import { contactLimits, validateEnquiry, type ContactErrors } from "@/lib/contact";
import { Icon } from "./Icon";

export default function ContactForm({ deliveryEnabled }: { deliveryEnabled: boolean }) {
  const query = useSearchParams();
  const selected = query.get("service") || "";
  const initialService = (serviceOptions as readonly string[]).includes(selected) ? selected : "";
  const [errors, setErrors] = useState<ContactErrors>({});
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error" | "development"; message: string } | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const input = Object.fromEntries(values.entries());
    const validated = validateEnquiry({ ...input, consent: values.get("consent") === "on" });
    setErrors(validated.errors);
    setResult(null);
    if (!validated.valid) {
      const first = Object.keys(validated.errors)[0];
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    inFlight.current = true;
    setPending(true);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(validated.data), signal: AbortSignal.timeout(20000) });
      const body = await response.json();
      if (body.errors) setErrors(body.errors);
      if (response.ok && body.status === "sent") {
        setResult({ type: "success", message: "Your enquiry has been accepted by our email provider. Thank you for telling us about your project." });
        form.reset();
      } else if (body.status === "development") {
        setResult({ type: "development", message: "Your form passed validation. Email delivery is not configured, so your message has not been sent or saved. Your text is still here." });
      } else {
        setResult({ type: "error", message: body.message || "We could not send your enquiry. Please try again. Your text is still here." });
      }
    } catch {
      setResult({ type: "error", message: "We could not confirm submission. Please check your connection and try again. Your text is still here." });
    } finally {
      inFlight.current = false;
      setPending(false);
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  }

  function error(key: keyof ContactErrors) { return errors[key] ? <p id={`${key}-error`} className="field-error">{errors[key]}</p> : null; }
  function accessibility(key: keyof ContactErrors) { return { "aria-invalid": Boolean(errors[key]), "aria-describedby": errors[key] ? `${key}-error` : undefined }; }

  return <form className="contact-form" onSubmit={submit} noValidate aria-busy={pending}>
    {!deliveryEnabled && <div className="form-notice"><strong>Development mode · Email delivery is not configured</strong><p>You can test the form and its validation. Enquiries will not be sent or saved until a real email provider and verified addresses are configured.</p></div>}
    <div className="form-grid">
      <div className="form-field"><label htmlFor="name">Name <span>(required)</span></label><input id="name" name="name" autoComplete="name" required maxLength={contactLimits.name} placeholder="Your name" {...accessibility("name")} />{error("name")}</div>
      <div className="form-field"><label htmlFor="email">Email <span>(required)</span></label><input id="email" name="email" type="email" autoComplete="email" required maxLength={contactLimits.email} placeholder="you@business.com" {...accessibility("email")} />{error("email")}</div>
      <div className="form-field full-width"><label htmlFor="organisation">Business or organisation <span>(optional)</span></label><input id="organisation" name="organisation" autoComplete="organization" maxLength={contactLimits.organisation} placeholder="Your business name" {...accessibility("organisation")} />{error("organisation")}</div>
      <div className="form-field full-width"><label htmlFor="service">What can we help with?</label><select key={initialService} id="service" name="service" defaultValue={initialService} {...accessibility("service")}><option value="">Select a service</option>{serviceOptions.map(option => <option key={option}>{option}</option>)}</select>{error("service")}</div>
      <div className="form-field full-width"><label htmlFor="description">Tell us about your project <span>(required)</span></label><textarea id="description" name="description" required maxLength={contactLimits.description} placeholder="What are you working on? What would you like to make easier?" {...accessibility("description")} />{error("description")}</div>
      <div className="form-field"><label htmlFor="budget">Budget <span>(optional)</span></label><input id="budget" name="budget" maxLength={contactLimits.budget} placeholder="A rough range, if you have one" {...accessibility("budget")} />{error("budget")}</div>
      <div className="form-field"><label htmlFor="timeline">Timeline <span>(optional)</span></label><input id="timeline" name="timeline" maxLength={contactLimits.timeline} placeholder="When would you like to start?" {...accessibility("timeline")} />{error("timeline")}</div>
    </div>
    <div className="form-honeypot" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input id="website" name="website" tabIndex={-1} autoComplete="off" maxLength={contactLimits.website} /></div>
    <div className="consent-field"><input type="checkbox" id="consent" name="consent" required {...accessibility("consent")} /><label htmlFor="consent">I agree to the processing of these details to respond to my enquiry, as described in the <Link href="/privacy-policy">draft Privacy Policy</Link>. (required)</label></div>{error("consent")}
    <div className="form-footer"><button className="button" type="submit" disabled={pending}>{pending ? "Submitting…" : deliveryEnabled ? "Send Enquiry" : "Test Enquiry Form"}<Icon /></button><p>Please avoid including passwords, financial records, or other sensitive information.</p></div>
    {result && <div ref={statusRef} tabIndex={-1} className={`form-status${result.type === "error" ? " error" : ""}`} role={result.type === "error" ? "alert" : "status"}>{result.message}</div>}
    <noscript><p className="form-status">Please enable JavaScript to use the enquiry form. Email delivery is currently subject to the configuration described above.</p></noscript>
  </form>;
}
