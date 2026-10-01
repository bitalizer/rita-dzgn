"use client";

import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Caret } from "@/components/ui/Icons";
import { budgets, projectTypes } from "@/content/home";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { type Lead, sendLead } from "@/lib/contact";
import { track } from "@/lib/zaraz";

type Status = "idle" | "sending" | "sent" | "error";

/** Underlined fields: 62px tall, 1px white rule, cream placeholder. */
const field =
  "w-full border-0 border-b border-paper bg-transparent px-[10px] py-5 text-body text-cream outline-none transition-colors duration-200 placeholder:text-cream focus:border-pink";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

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
    const result = await sendLead(lead);
    if (result.ok) {
      setStatus("sent");
      track("lead", { type: lead.type, budget: lead.budget });
      form.reset();
    } else {
      setStatus("error");
      setError(result.error);
    }
  }

  const sent = status === "sent";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-10" aria-describedby="contact-note">
      <div className="flex flex-col gap-5">
        <input name="name" placeholder="Name" required autoComplete="name" className={field} aria-label="Name" />
        <input name="email" type="email" placeholder="E-mail" required autoComplete="email" className={field} aria-label="E-mail" />
        <textarea
          name="message"
          placeholder="Tell me about your project"
          rows={1}
          required
          className={cn(field, "block min-h-[62px] resize-none")}
          aria-label="Tell me about your project"
        />
        <div className="relative">
          <select name="type" defaultValue="" className={cn(field, "cursor-pointer appearance-none pr-[30px]")} aria-label="Project type">
            <option value="">Project type</option>
            {projectTypes.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Caret className="pointer-events-none absolute top-1/2 right-[15px] -translate-y-1/2" />
        </div>
        <div className="relative">
          <select name="budget" defaultValue="" className={cn(field, "cursor-pointer appearance-none pr-[30px]")} aria-label="Budget">
            <option value="">Budget</option>
            {budgets.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Caret className="pointer-events-none absolute top-1/2 right-[15px] -translate-y-1/2" />
        </div>
        {/* Honeypot: hidden from people, irresistible to bots. */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
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
