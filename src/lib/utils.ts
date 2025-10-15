import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow } from "date-fns"

// detect production in various env shapes (Vite / NODE / others)
const IS_PROD = (() => {
  try {
    const env = import.meta.env
    return (
      env?.NODE_ENV === "production" ||
      env?.MODE === "production" ||
      env?.PROD === true
    )
  } catch {
    return false
  }
})()

export class Logger {
  private prefix: string

  constructor(prefix = "Logger") {
    this.prefix = prefix
  }

  info(message?: unknown, ...optionalParams: unknown[]) {
    if (!IS_PROD) {
      console.info(`[${this.prefix}]:`, message, ...optionalParams)
    }
  }

  error(message?: unknown, ...optionalParams: unknown[]) {
    if (!IS_PROD) {
      console.error(`[${this.prefix}]:`, message, ...optionalParams)
    }
  }

  // alias
  log(message?: unknown, ...optionalParams: unknown[]) {
    this.info(message, ...optionalParams)
  }
}

/**
 * Convert various timestamp shapes (Firestore Timestamp, Date, number, ISO string)
 * into a human readable string. For times within 24 hours returns relative
 * (e.g. "3 hours ago"), otherwise returns formatted date (e.g. "Oct 15, 2025").
 */
export function formatTime(
  ts?: { toDate?: () => Date } | Date | number | string | null,
  opts?: { formatStr?: string }
): string {
  if (!ts) return ""

  let date: Date
  if (typeof ts === "number") {
    date = new Date(ts)
  } else if (ts instanceof Date) {
    date = ts
  } else if (typeof ts === "string") {
    date = new Date(ts)
  } else if (typeof ts === "object" && typeof ts.toDate === "function") {
    // Firestore Timestamp
    date = ts.toDate()
  } else {
    date = new Date(ts as Date)
  }

  if (Number.isNaN(date.getTime())) return ""

  const diff = Date.now() - date.getTime()
  const ONE_DAY_MS = 24 * 60 * 60 * 1000

  if (diff < ONE_DAY_MS) {
    return formatDistanceToNow(date, { addSuffix: true })
  }

  return format(date, opts?.formatStr ?? "MMM d, yyyy")
}

export const logger = new Logger()

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
