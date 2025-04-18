import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  const textareaClassName = cn(
    "border-input flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-muted-foreground disabled:bg-background/50",
    "focus-visible:border-ring focus-visible:ring-ring/50",
    "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
    className
  )

  return (
    <textarea
      data-slot="textarea"
      className={textareaClassName}
      {...props}
    />
  )
}

export { Textarea }
