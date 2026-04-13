export type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[]
  | { [key: string]: boolean | null | undefined }

function flatten(input: ClassValue, classes: string[]) {
  if (!input) return

  if (typeof input === "string" || typeof input === "number") {
    classes.push(String(input))
    return
  }

  if (Array.isArray(input)) {
    for (const value of input) flatten(value, classes)
    return
  }

  if (typeof input === "object") {
    for (const [key, value] of Object.entries(input)) {
      if (value) classes.push(key)
    }
  }
}

export function cn(...inputs: ClassValue[]) {
  const classes: string[] = []

  for (const input of inputs) flatten(input, classes)

  return classes.join(" ")
}
