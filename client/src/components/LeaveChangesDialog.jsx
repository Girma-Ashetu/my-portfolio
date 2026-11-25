import { useEffect, useRef } from 'react';

export default function LeaveChangesDialog({ onStay, onLeave }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    const opener = document.activeElement;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => { element.close(); document.body.style.overflow = overflow; opener?.focus(); };
  }, []);
  return <dialog ref={dialog} className="studio-dialog studio-leave-dialog" aria-labelledby="leave-title" aria-describedby="leave-description" onCancel={event => { event.preventDefault(); onStay(); }}>
    <div className="studio-dialog-body"><p className="studio-eyebrow">UNSAVED CHANGES</p><h2 id="leave-title">Keep working on your changes?</h2><p id="leave-description">Your latest edits haven’t been saved. Stay to review and save them, or discard them to continue.</p><div className="studio-actions"><button autoFocus className="studio-button" onClick={onStay}>Stay and keep editing</button><button className="studio-button secondary" onClick={onLeave}>Discard changes</button></div></div>
  </dialog>;
}
