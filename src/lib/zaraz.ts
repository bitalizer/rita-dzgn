/**
 * Cloudflare Zaraz loads third-party tools (Google Ads, Meta Pixel, …) from the dashboard, gated by its consent banner.
 * Everything here is a no-op until Zaraz is enabled for the domain, so the site works the same with or without it.
 */
type Zaraz = {
  track: (event: string, properties?: Record<string, unknown>) => void;
  showConsentModal?: () => void;
  consent?: unknown;
};

const zaraz = () => (typeof window === "undefined" ? undefined : (window as Window & { zaraz?: Zaraz }).zaraz);

/** Conversion events for ad platforms. Never pass personal data (name, e-mail, message) here. */
export function track(event: string, properties?: Record<string, unknown>) {
  zaraz()?.track(event, properties);
}

/** True once Zaraz consent management is enabled — the "cookie settings" link only shows then. */
export const hasConsentManager = () => typeof zaraz()?.showConsentModal === "function";

export const openConsentSettings = () => zaraz()?.showConsentModal?.();
