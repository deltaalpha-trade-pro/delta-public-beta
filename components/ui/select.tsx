'use client'

import * as React from 'react'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type SelectContextValue = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  value: string
  onValueChange?: (value: string) => void
  registerOption: (value: string, label: React.ReactNode) => void
  options: Record<string, React.ReactNode>
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

function useSelectContext(componentName: string) {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error(`${componentName} must be used within Select`)
  }
  return context
}

function Select({
  children,
  defaultValue = "",
  onValueChange,
  value,
}: {
  children: React.ReactNode
  defaultValue?: string
  onValueChange?: (value: string) => void
  value?: string
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState<Record<string, React.ReactNode>>({})
  const currentValue = value ?? internalValue

  const handleValueChange = React.useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setInternalValue(nextValue)
      }
      onValueChange?.(nextValue)
      setOpen(false)
    },
    [onValueChange, value],
  )

  const registerOption = React.useCallback((optionValue: string, label: React.ReactNode) => {
    setOptions((prev) => {
      if (prev[optionValue] === label) return prev
      return { ...prev, [optionValue]: label }
    })
  }, [])

  return (
    <SelectContext.Provider
      value={{
        open,
        setOpen,
        value: currentValue,
        onValueChange: handleValueChange,
        registerOption,
        options,
      }}
    >
      <div data-slot="select" className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

function SelectTrigger({
  className,
  size = 'default',
  children,
  onClick,
  ...props
}: React.ComponentProps<'button'> & {
  size?: 'sm' | 'default'
}) {
  const { open, setOpen } = useSelectContext('SelectTrigger')

  return (
    <button
      type="button"
      data-slot="select-trigger"
      data-size={size}
      aria-expanded={open}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          setOpen((current) => !current)
        }
      }}
    >
      {children}
      <ChevronDownIcon className="size-4 opacity-50" />
    </button>
  )
}

function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  const { open } = useSelectContext('SelectContent')

  if (!open) return null

  return (
    <div
      data-slot="select-content"
      role="listbox"
      className={cn(
        'bg-popover text-popover-foreground absolute top-[calc(100%+0.25rem)] left-0 z-50 min-w-[8rem] overflow-hidden rounded-md border shadow-md',
        className,
      )}
      {...props}
    >
      <div className="max-h-60 overflow-y-auto p-1">{children}</div>
    </div>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="select-label"
      className={cn('text-muted-foreground px-2 py-1.5 text-xs', className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  onClick,
  value,
  ...props
}: React.ComponentProps<'button'> & {
  value: string
}) {
  const { onValueChange, registerOption, value: selectedValue } = useSelectContext('SelectItem')
  const selected = selectedValue === value

  React.useEffect(() => {
    registerOption(value, children)
  }, [children, registerOption, value])

  return (
    <button
      type="button"
      data-slot="select-item"
      data-state={selected ? 'checked' : 'unchecked'}
      role="option"
      aria-selected={selected}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className,
      )}
      {...props}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          onValueChange?.(value)
        }
      }}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        {selected ? <CheckIcon className="size-4" /> : null}
      </span>
      <span>{children}</span>
    </button>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="select-separator"
      className={cn('bg-border pointer-events-none -mx-1 my-1 h-px', className)}
      {...props}
    />
  )
}

function SelectScrollUpButton() {
  return null
}

function SelectScrollDownButton() {
  return null
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return <div data-slot="select-group" className={className} {...props} />
}

function SelectValue({
  className,
  placeholder,
  ...props
}: React.ComponentProps<'span'> & {
  placeholder?: React.ReactNode
}) {
  const { options, value } = useSelectContext('SelectValue')
  const displayValue = options[value] ?? value

  return (
    <span data-slot="select-value" className={className} {...props}>
      {displayValue || placeholder}
    </span>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
