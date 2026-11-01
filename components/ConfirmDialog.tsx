'use client'

import { useEffect, useId, useRef } from 'react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel: string
  cancelLabel: string
  /** While true the dialog can't be dismissed and the buttons are disabled. */
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * A themed confirmation modal on the native <dialog> element, which supplies
 * the focus trap, Escape to close, the inert page behind it and the return of
 * focus to the button that opened it. Focus starts on Cancel so an accidental
 * Enter never deletes anything.
 */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      cancelRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // Keep the page from scrolling behind the modal.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        // Escape: let our state close it, not the browser.
        event.preventDefault()
        if (!busy) onCancel()
      }}
      onClick={(event) => {
        // A click on the backdrop lands on the <dialog> itself, not its panel.
        if (event.target === dialogRef.current && !busy) onCancel()
      }}
      className="confirm-dialog m-auto w-[calc(100%-2rem)] max-w-sm rounded-lg border border-rule bg-surface p-0 text-ink shadow-xl backdrop:bg-ink/40 backdrop:backdrop-blur-[2px]"
    >
      <div className="p-5 sm:p-6">
        <h2 id={titleId} className="font-serif text-lg font-medium text-ink">
          {title}
        </h2>
        {description && (
          <p id={descriptionId} className="mt-2 text-sm leading-relaxed text-ink-2">
            {description}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-md border border-rule px-4 py-2 text-sm text-ink-2 transition-colors hover:border-ink-3 hover:text-ink disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}
