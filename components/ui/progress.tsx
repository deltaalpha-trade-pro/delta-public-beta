'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

function Progress({
  className,
  value = 0,
  ...props
}: React.ComponentProps<'div'> & {
  value?: number
}) {
  const normalizedValue = Math.min(100, Math.max(0, value))

  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={normalizedValue}
      className={cn(
        'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
        className,
      )}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - normalizedValue}%)` }}
      />
    </div>
  )
}

export { Progress }
