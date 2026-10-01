"use client";

import { type FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Caret } from "@/components/ui/Icons";
import { budgets, projectTypes } from "@/content/home";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { type Lead, sendLead } from "@/lib/contact";
import { track } from "@/lib/zaraz";

type Status = "idle" | "sending" | "sent" | "error";

const labelOf = (options: { value: string; label: string }[], value: string) => options.find((o) => o.value === value)?.label ?? value;

/** Underlined fields: 62px tall, 1px white rule. The label and the pink focus line come from <Field>. */
const field = "w-full border-0 border-b border-paper bg-transparent px-2.5 py-5 text-body text-cream outline-none";

/**
 * A field with its floating label. The label rests where a placeholder would and rises above the text once the field
 * is focused or filled, so the visitor never loses sight of what the field is for; a pink line draws in under the field
 * that has focus. All of it is CSS (globals.css → [data-field]), keyed on the control's own state, so the control must
 * be the first child and text controls need `placeholder=" "` (that is how CSS can tell an empty one from a filled one).
 */
function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div data-field className="relative">
      {children}
      <label htmlFor={id} className="text-body">
        {label}
      </label>
      <span data-underline aria-hidden="true" />
    </div>
  );
}

const nothingPicked = { type: false, budget: false };

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  // A select can't tell CSS whether it holds a choice (text fields can), so the form tracks it: data-filled lifts the label.
  const [picked, setPicked] = useState(nothingPicked);
  const pick = (name: keyof typeof nothingPicked, value: string) => setPicked((p) => ({ ...p, [name]: value !== "" }));
  const formRef = useRef<HTMLFormElement>(null);
  // Browsers put a form's values back when the page is reloaded or revisited, before React is running: start from what
  // the selects really hold, or a restored choice would sit hidden under a resting label.
  useEffect(() => {
    const value = (name: string) => (formRef.current?.elements.namedItem(name) as HTMLSelectElement | null)?.value ?? "";
    setPicked({ type: value("type") !== "", budget: value("budget") !== "" });
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const lead: Lead = {
      name: data.name?.trim() ?? "",
      email: data.email?.trim() ?? "",
      message: data.message?.trim() ?? "",
      type: data.type ?? "",
      budget: data.budget ?? "",
      company: data.company ?? "",
    };
    if (lead.company) return; // honeypot tripped — silently ignore

    setStatus("sending");
    // The message shows the option labels ("Website design"), the conversion event keeps the stable values.
    const result = await sendLead({ ...lead, type: labelOf(projectTypes, lead.type), budget: labelOf(budgets, lead.budget) });
    if (result.ok) {
      setStatus("sent");
      track("lead", { type: lead.type, budget: lead.budget });
      form.reset();
      setPicked(nothingPicked);
    } else {
      setStatus("error");
      setError(result.error);
    }
  }

  const sent = status === "sent";

  return (
    <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-10" aria-describedby="contact-note">
      <div className="flex flex-col gap-5">
        <Field id="contact-name" label="Name">
          <input id="contact-name" name="name" placeholder=" " required autoComplete="name" className={field} />
        </Field>
        <Field id="contact-email" label="E-mail">
          <input id="contact-email" name="email" type="email" placeholder=" " required autoComplete="email" className={field} />
        </Field>
        <Field id="contact-message" label="Tell me about your project">
          <textarea
            id="contact-message"
            name="message"
            placeholder=" "
            rows={1}
            required
            maxLength={4000}
            className={cn(field, "block min-h-15.5 resize-none")}
          />
        </Field>
        <Field id="contact-type" label="Project type">
          <select
            id="contact-type"
            name="type"
            defaultValue=""
            data-filled={picked.type ? "" : undefined}
            onChange={(e) => pick("type", e.currentTarget.value)}
            className={cn(field, "cursor-pointer appearance-none pr-7.5")}
          >
            <option value="">—</option>
            {projectTypes.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Caret className="pointer-events-none absolute top-1/2 right-3.75 -translate-y-1/2" />
        </Field>
        <Field id="contact-budget" label="Budget">
          <select
            id="contact-budget"
            name="budget"
            defaultValue=""
            data-filled={picked.budget ? "" : undefined}
            onChange={(e) => pick("budget", e.currentTarget.value)}
            className={cn(field, "cursor-pointer appearance-none pr-7.5")}
          >
            <option value="">—</option>
            {budgets.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Caret className="pointer-events-none absolute top-1/2 right-3.75 -translate-y-1/2" />
        </Field>
        {/* Honeypot: hidden from people, irresistible to bots. */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />
      </div>

      <p id="contact-note" className="text-body text-cream/50">
        Your details are used only to reply to you — see the{" "}
        <a href={site.privacyPolicyUrl} className="underline underline-offset-[3px]">
          Privacy Policy
        </a>
        .
      </p>

      <Button type="submit" variant="pink" disabled={status === "sending" || sent} className="w-full disabled:cursor-default disabled:opacity-90">
        {status === "sending" ? "Sending…" : sent ? "Sent — talk soon" : "Send"}
      </Button>

      <p role="status" aria-live="polite" className={cn("-mt-6 text-body", status === "error" ? "text-pink" : "sr-only")}>
        {status === "error" && (
          <>
            {error} You can also write to{" "}
            <a href={`mailto:${site.contact.email}`} className="underline">
              {site.contact.email}
            </a>
            .
          </>
        )}
      </p>
    </form>
  );
}
