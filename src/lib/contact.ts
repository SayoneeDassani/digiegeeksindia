import { serviceOptions } from "./services";

export type Enquiry = {
  name: string;
  email: string;
  organisation: string;
  service: string;
  description: string;
  budget: string;
  timeline: string;
  consent: boolean;
  website: string;
};
export type ContactErrors = Partial<Record<keyof Enquiry, string>>;
export const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
export const contactLimits = { name: 100, email: 254, organisation: 150, service: 100, description: 5000, budget: 100, timeline: 150, website: 200 } as const;

export function validateEnquiry(input: unknown): { data: Enquiry; errors: ContactErrors; valid: boolean } {
  const record = input && typeof input === "object" && !Array.isArray(input) ? input as Record<string, unknown> : {};
  const text = (key: string) => typeof record[key] === "string" ? (record[key] as string).trim() : "";
  const data: Enquiry = { name: text("name"), email: text("email"), organisation: text("organisation"), service: text("service"), description: text("description"), budget: text("budget"), timeline: text("timeline"), consent: record.consent === true, website: text("website") };
  const errors: ContactErrors = {};
  if (!data.name) errors.name = "Please enter your name.";
  if (!emailPattern.test(data.email)) errors.email = "Please enter a valid email address.";
  if (!data.description) errors.description = "Tell us a little about your project.";
  if (data.service && !(serviceOptions as readonly string[]).includes(data.service)) errors.service = "Please choose a service from the list.";
  if (!data.consent) errors.consent = "Please agree to the privacy notice before continuing.";
  for (const key of Object.keys(contactLimits) as (keyof typeof contactLimits)[]) {
    if (data[key].length > contactLimits[key]) errors[key] = `Please use ${contactLimits[key]} characters or fewer.`;
    if (key !== "description" && /[\r\n\u0000]/.test(data[key])) errors[key] = "Please enter a single line of text.";
  }
  if (data.website) errors.website = "We could not accept this submission.";
  return { data, errors, valid: Object.keys(errors).length === 0 };
}
