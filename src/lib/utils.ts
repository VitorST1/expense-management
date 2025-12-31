import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { m } from "@/paraglide/messages"

type MessageMap = typeof m

interface MessageKeyOptions {
  prefix: string
  value: string
  regex?: RegExp
  replacer?: string
  transform?: (str: string) => string
  fallback?: string
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInternationalizationMessageFromKey({
  prefix,
  value,
  regex = / /g,
  replacer = "_",
  transform = (s) => s.toLowerCase(),
  fallback,
}: MessageKeyOptions): string | undefined {
  const normalized = transform(value).replace(regex, replacer)
  const key = `${prefix}${normalized}` as keyof MessageMap
  const msgFn = m[key]

  return typeof msgFn === "function" ? (msgFn as () => string)() : fallback
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
