import type { ReportSender } from "./deps";

/**
 * Posts each report as JSON to a Formspree form. Rejects on network errors and non-2xx replies,
 * so the player sees Retry. With no form configured, every send fails rather than vanishing.
 */
export function formspreeReportSender(formId: string | undefined): ReportSender {
  return {
    async send(report) {
      if (!formId) throw new Error("No Formspree form configured (NEXT_PUBLIC_FORMSPREE_FORM_ID)");
      const response = await fetch(`https://formspree.io/f/${encodeURIComponent(formId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...report, ...deviceInfo() }),
      });
      if (!response.ok) throw new Error(`Formspree replied ${response.status}`);
    },
  };
}

/** What the reporter was using, so a bug can be reproduced on the same phone and browser. */
function deviceInfo() {
  if (typeof navigator === "undefined") return {};
  const ua = navigator.userAgent;
  return {
    device: [deviceName(ua), osName(ua), browserName(ua)].join(" · "),
    screen: `${window.screen.width}x${window.screen.height} @${window.devicePixelRatio}x`,
    // The space the page actually gets, after the browser's own bars.
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    // Older iPhones only say so through navigator.standalone.
    homeScreen:
      window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone
        ? "yes"
        : "no",
    phoneLanguage: navigator.language,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    userAgent: ua,
  };
}

function deviceName(ua: string): string {
  if (/iPhone/.test(ua)) return "iPhone";
  // iPadOS asks for the desktop site and claims to be a Mac; touch gives it away.
  if (/iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "iPad";
  const android = ua.match(/Android [^;]+; ([^;)]+?)(?: Build|\))/);
  // Newer Chrome hides the model and sends "K" instead.
  if (android) return android[1] === "K" ? "Android phone" : android[1];
  return /Mobile/.test(ua) ? "Phone" : "Desktop";
}

function osName(ua: string): string {
  const ios = ua.match(/OS (\d+[_\d]*) like Mac OS X/);
  if (ios) return `iOS ${ios[1].replace(/_/g, ".")}`;
  const android = ua.match(/Android ([\d.]+)/);
  if (android) return `Android ${android[1]}`;
  if (/Windows/.test(ua)) return "Windows";
  if (/Mac OS X/.test(ua)) return navigator.maxTouchPoints > 1 ? "iPadOS" : "macOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Unknown OS";
}

function browserName(ua: string): string {
  // Most browsers also claim to be Chrome or Safari, so the more specific names are checked first.
  const browsers: [RegExp, string][] = [
    [/(?:Edg|EdgiOS)\/(\d+)/, "Edge"],
    [/SamsungBrowser\/(\d+)/, "Samsung Internet"],
    [/OPR\/(\d+)/, "Opera"],
    [/(?:Firefox|FxiOS)\/(\d+)/, "Firefox"],
    [/(?:CriOS|Chrome)\/(\d+)/, "Chrome"],
    [/Version\/([\d.]+).*Safari/, "Safari"],
  ];
  for (const [pattern, name] of browsers) {
    const match = ua.match(pattern);
    if (match) return `${name} ${match[1]}`;
  }
  return "Unknown browser";
}
