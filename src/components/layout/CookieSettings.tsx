"use client";

import { useEffect, useState } from "react";
import { hasConsentManager, openConsentSettings } from "@/lib/zaraz";

/** Reopens the Zaraz consent banner. Renders nothing until consent management is enabled for the domain. */
export function CookieSettings({ className }: { className?: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (hasConsentManager()) return setReady(true);
    // Zaraz loads after the page; check again once it has had a chance to initialise.
    const t = setTimeout(() => setReady(hasConsentManager()), 1500);
    return () => clearTimeout(t);
  }, []);
  if (!ready) return null;
  return (
    <button type="button" onClick={openConsentSettings} className={className}>
      (cookie settings)
    </button>
  );
}
