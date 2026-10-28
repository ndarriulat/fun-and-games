// Halloween 2026: remove in ticket 03, with everything marked "Halloween 2026".
import { useEffect } from "react";

/** "Are you sure?" over the screen, for anything that can't be undone. Escape or Cancel closes it. */
export function ConfirmDialog({
  title,
  body,
  confirm,
  cancel,
  onConfirm,
  onCancel,
}: {
  title: string;
  body: string;
  confirm: string;
  cancel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="overlay">
      <div className="report" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-body">
        <h2 id="confirm-title" className="report-title">
          {title}
        </h2>
        <p id="confirm-body" className="confirm-body">
          {body}
        </p>
        <div className="report-actions">
          <button type="button" className="report-secondary" onClick={onCancel} autoFocus>
            {cancel}
          </button>
          <button type="button" className="report-primary" onClick={onConfirm}>
            {confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
