"use client";

import { useEffect } from "react";
import { captureSource } from "@/lib/attribution";

/** Records the lead source on the first page load (see lib/attribution.ts). Mount once in app/layout.tsx. */
export function Attribution() {
  useEffect(captureSource, []);
  return null;
}
