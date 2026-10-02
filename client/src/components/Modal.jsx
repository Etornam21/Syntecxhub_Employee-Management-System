import { useEffect, useRef } from 'react';

// Native <dialog> gives focus trapping and Esc-to-close for free.
export default function Modal({ open, onClose, labelledBy, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      {open && <div className="modal-body">{children}</div>}
    </dialog>
  );
}
