// Base Modal component using native <dialog> element
// Renders to portal, handles ESC key and backdrop click
import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export function Modal({ isOpen, onClose, children, ariaLabel }) {
  const dialogRef = useRef(null);

  // Sync React state with dialog's open property
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal(); // Opens as modal with backdrop
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Handle ESC key (cancel event) and backdrop click
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e) => {
      e.preventDefault(); // Prevent default close
      onClose();
    };

    const handleClick = (e) => {
      // Close on backdrop click (click on dialog element itself, not content)
      if (e.target === dialog) {
        onClose();
      }
    };

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('click', handleClick);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('click', handleClick);
    };
  }, [onClose]);

  return createPortal(
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/50 bg-white rounded-lg shadow-xl max-w-lg w-full p-0"
      aria-label={ariaLabel}
    >
      {children}
    </dialog>,
    document.body
  );
}
