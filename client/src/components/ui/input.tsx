import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const inputClassName = cn(
    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:text-sm file:font-medium file:cursor-pointer focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-background/50",
    "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
    className
  )

  return (
    <input
      type={type}
      data-slot="input"
      className={inputClassName}
      {...props}
    />
  )
}

export { Input }
