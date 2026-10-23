import { useEffect, useState } from "react";
import { appStorage } from "@/play/storage";
import { allTopics, isTopicHidden } from "@/play/topics";
import { appVersion } from "./appVersion";
import { REPORT_NOTE_LIMIT, reportReasons, useDeps, type Report, type ReportedCard, type ReportReason } from "./deps";
import { useLanguage } from "./language";

type Status = "editing" | "sending" | "sent" | "failed";

/** Over the card: pick a reason, add a note, send. Closing it leaves the card as it was. */
export function ReportOverlay({ card, onClose }: { card: ReportedCard; onClose: () => void }) {
  const { reports, storage } = useDeps();
  const { language, t } = useLanguage();
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<Status>("editing");
  // Kept so Retry resends exactly what failed.
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function deliver(attempt: Report) {
    setReport(attempt);
    setStatus("sending");
    try {
      await reports.send(attempt);
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  }

  function submit() {
    if (!reason) return;
    const trimmed = note.trim();
    const saved = appStorage(storage);
    const state = saved.load();
    const deviceId = state.deviceId ?? crypto.randomUUID();
    if (!state.deviceId) saved.update((current) => ({ ...current, deviceId }));
    const hidden = allTopics.filter((topic) => isTopicHidden(topic, state.topics));
    void deliver({
      ...card,
      reason,
      ...(trimmed && { note: trimmed }),
      appVersion,
      appLanguage: language,
      hiddenTopics: hidden.length > 0 ? hidden.join(", ") : "none",
      deviceId,
      timestamp: new Date().toISOString(),
    });
  }

  return (
    <div className="overlay">
      <div className="report" role="dialog" aria-modal="true" aria-labelledby="report-title">
        <h2 id="report-title" className="report-title">
          {t.report.title}
        </h2>
        {status === "sent" ? (
          <>
            <p className="report-sent" role="status">
              {t.report.sent}
            </p>
            <div className="report-actions">
              <button type="button" className="report-primary" onClick={onClose}>
                {t.report.backToCard}
              </button>
            </div>
          </>
        ) : (
          <form
            className="report-form"
            onSubmit={(event) => {
              event.preventDefault();
              // After a failure the form is locked, and the button retries the same report.
              if (status === "failed" && report) void deliver(report);
              else submit();
            }}
          >
            <fieldset className="report-reasons" disabled={status !== "editing"}>
              <legend className="setting-name">{t.report.reason}</legend>
              {reportReasons.map((option) => (
                <label key={option} className="report-reason">
                  <input
                    type="radio"
                    name="reason"
                    value={option}
                    checked={reason === option}
                    onChange={() => setReason(option)}
                  />
                  {t.report.reasons[option]}
                </label>
              ))}
            </fieldset>
            <label className="report-note">
              <span className="setting-name">{t.report.note}</span>
              <textarea
                value={note}
                maxLength={REPORT_NOTE_LIMIT}
                rows={3}
                disabled={status !== "editing"}
                onChange={(event) => setNote(event.target.value)}
              />
              <span className="report-count">{t.report.charactersLeft(REPORT_NOTE_LIMIT - note.length)}</span>
            </label>
            {status === "failed" && (
              <p className="report-error" role="alert">
                {t.report.failed}
              </p>
            )}
            <div className="report-actions">
              <button type="button" className="report-secondary" onClick={onClose}>
                {t.report.cancel}
              </button>
              <button type="submit" className="report-primary" disabled={!reason || status === "sending"}>
                {status === "sending" ? t.report.sending : status === "failed" ? t.report.retry : t.report.send}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
