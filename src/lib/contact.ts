export function buildMailto(email: string, subject?: string): string {
  if (!subject) return `mailto:${email}`
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`
}
