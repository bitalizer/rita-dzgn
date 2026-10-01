"use client";

import { useEffect } from "react";
import { loadWebAnalytics } from "@/lib/analytics";

/** Loads the visitor statistics after the page has loaded (see lib/analytics.ts). Mount once in app/layout.tsx. */
export function WebAnalytics() {
  useEffect(loadWebAnalytics, []);
  return null;
}
