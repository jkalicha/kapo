/**
 * Sanitizes user-submitted messages to prevent contact-bypass attempts.
 * Removes Uruguayan phone numbers, generic long digit sequences, and email addresses.
 */
export function sanitizeMessage(text: string): string {
  return text
    // Remove Uruguayan mobile numbers (09X format)
    .replace(
      /(\+598\s?)?0?9[1-9][\s\-.]?\d{3}[\s\-.]?\d{3}/g,
      '[número eliminado]',
    )
    // Remove landline patterns
    .replace(/(\+598\s?)?[24]\d{3}[\s\-.]?\d{4}/g, '[número eliminado]')
    // Remove generic number sequences that look like phones (7+ consecutive digits)
    .replace(/\b\d{7,}\b/g, '[número eliminado]')
    // Remove email addresses
    .replace(
      /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,
      '[contacto eliminado]',
    )
    .trim()
}
