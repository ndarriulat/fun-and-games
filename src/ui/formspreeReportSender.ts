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
        body: JSON.stringify(report),
      });
      if (!response.ok) throw new Error(`Formspree replied ${response.status}`);
    },
  };
}
