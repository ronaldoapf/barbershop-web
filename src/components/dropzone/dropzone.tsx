import { useCallback, useState } from "react"
import { useDropzone, type DropzoneOptions } from "react-dropzone"
import { UploadCloud, X } from "lucide-react"

import { cn } from "@/lib/utils"

import { FilePreview } from "./file-preview"
import { ImageLightbox } from "./image-lightbox"
import { formatBytes } from "./utils"
import { Button } from "../ui/button"

interface DropzoneProps {
  value?: File[]
  onFilesChange: (files: File[]) => void
  hint?: string
  className?: string
  disabled?: boolean
  accept?: DropzoneOptions["accept"]
  maxFiles?: number
  maxSize?: number
  multiple?: boolean
}

export function Dropzone({
  value = [],
  onFilesChange,
  hint,
  className,
  disabled,
  accept,
  maxFiles,
  maxSize,
  multiple = true,
}: DropzoneProps): React.JSX.Element {
  const [previewFile, setPreviewFile] = useState<File | null>(null)

  const onDrop = useCallback(
    (accepted: File[]) => {
      onFilesChange(multiple === false ? accepted : [...value, ...accepted])
    },
    [value, onFilesChange, multiple]
  )

  const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    multiple,
    disabled,
  })

  function removeFile(index: number): void {
    onFilesChange(value.filter((_, i) => i !== index))
  }

  const onRemoveFile = (e: React.MouseEvent<HTMLButtonElement>, index: number) => { 
    e.stopPropagation(); 
    removeFile(index) 
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-10 transition-all duration-200",
          "border-border bg-background text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          !disabled && "hover:border-primary/60 hover:bg-primary/[0.02]",
          isDragAccept && "border-primary bg-primary/5 text-primary",
          isDragReject && "border-destructive bg-destructive/5 text-destructive",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud
          strokeWidth={1.5}
          className={cn(
            "size-10 transition-transform duration-300 ease-out",
            !disabled && "group-hover:-translate-y-0.5",
            isDragAccept && "-translate-y-1 text-primary",
            isDragReject && "text-destructive",
          )}
        />
        <div className="space-y-1 text-center">
          <p className="text-sm font-medium text-foreground">
            {isDragAccept
              ? "Solte os arquivos aqui"
              : isDragReject
                ? "Arquivo não suportado"
                : "Arraste arquivos ou clique para selecionar"}
          </p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </div>

      {value.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground text-right">
            {value.length} {value.length === 1 ? "arquivo selecionado" : "arquivos selecionados"}
          </p>
          <ul role="list" aria-label="Arquivos selecionados" className="flex max-h-[240px] flex-col gap-1.5 overflow-y-auto pr-1 scrollbar-thin">
            {value.map((file, index) => {
              const isImage = file.type.startsWith("image/")
              return (
                <li
                  key={`${file.name}-${index}`}
                  className={cn(
                    "flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2 transition-colors",
                    isImage && "cursor-pointer hover:bg-muted/50",
                  )}
                  onClick={() => isImage && setPreviewFile(file)}
                >
                  <FilePreview file={file} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    aria-label={`Remover ${file.name}`}
                    onClick={(e) => onRemoveFile(e, index)}
                    className="hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <X className="size-3.5" />
                  </Button>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {previewFile && (
        <ImageLightbox file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  )
}
