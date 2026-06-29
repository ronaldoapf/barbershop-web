import { FileText } from "lucide-react"

import { useObjectUrl } from "./use-object-url"

interface FilePreviewProps {
  file: File
}

export function FilePreview({ file }: FilePreviewProps): React.JSX.Element {
  const isImage = file.type.startsWith("image/")
  const url = useObjectUrl(isImage ? file : null)

  if (isImage && url) {
    return <img src={url} alt={file.name} className="size-8 shrink-0 rounded-sm object-cover" />
  }

  return <FileText className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
}
