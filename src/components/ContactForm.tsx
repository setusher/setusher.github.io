"use client";

import { useState } from "react";
import { site } from "@/lib/content";

const field =
  "peer w-full border-0 border-b border-[#4a4a4a] bg-transparent px-0 pb-2.5 pt-6 text-[15px] text-white outline-none transition-colors placeholder:text-transparent focus:border-mint";
const label =
  "pointer-events-none absolute left-0 top-6 text-[13px] tracking-[0.12em] text-muted transition-all duration-200 peer-focus:top-0 peer-focus:text-[11px] peer-focus:text-mint peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[11px]";

/** No backend on a static site: submitting opens the visitor's mail app with the message filled in. */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const subject = `Portfolio contact from ${name}`;
    const body = `${message}\n\n${name}\n${email}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8" noValidate={false}>
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="relative">
          <input id="cf-name" name="name" required autoComplete="name" placeholder="Name" className={field} />
          <label htmlFor="cf-name" className={label}>Name</label>
        </div>
        <div className="relative">
          <input id="cf-email" name="email" type="email" required autoComplete="email" placeholder="Email" className={field} />
          <label htmlFor="cf-email" className={label}>Email</label>
        </div>
      </div>
      <div className="relative">
        <textarea id="cf-message" name="message" required rows={4} placeholder="Message" className={`${field} resize-y`} />
        <label htmlFor="cf-message" className={label}>Message</label>
      </div>
      <div className="flex flex-wrap items-center gap-6 pt-2">
        <button type="submit" className="btn-outline cursor-pointer">
          Send message
        </button>
        <p role="status" className="text-[13px] text-muted">
          {sent ? "Your mail app should open with the message ready to send." : ""}
        </p>
      </div>
    </form>
  );
}
