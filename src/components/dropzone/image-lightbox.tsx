import { useEffect } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

import { useObjectUrl } from "./use-object-url"

interface ImageLightboxProps {
  file: File
  onClose: () => void
}

export function ImageLightbox({ file, onClose }: ImageLightboxProps): React.JSX.Element {
  const url = useObjectUrl(file)

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={file.name}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {url && (
          <img
            src={url}
            alt={file.name}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
          />
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar visualização"
          className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-foreground backdrop-blur-sm transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" />
        </button>
        <p className="absolute bottom-2 left-2 rounded bg-background/80 px-2 py-1 text-xs text-foreground backdrop-blur-sm">
          {file.name}
        </p>
      </div>
    </div>,
    document.body,
  )
}
