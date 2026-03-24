/**
 * Cleans WordPress Gutenberg block comments from HTML content
 * Preserves the actual HTML inside the blocks
 */
export function renderWordPressContent(content: string): string {
  if (!content) return ''

  let html = content

  // Remove all Gutenberg block comments (opening and closing)
  html = html.replace(/<!-- \/?(wp:[a-zA-Z0-9/-]+)(\s[^>]*)? ?\/?-->/g, '')

  // Clean up wp: class prefixes that are verbose but harmless — keep the HTML
  // Remove empty paragraphs
  html = html.replace(/<p[^>]*>\s*&nbsp;\s*<\/p>/g, '')
  html = html.replace(/<p[^>]*>\s*<\/p>/g, '')

  // Trim excess whitespace lines
  html = html.replace(/\n{3,}/g, '\n\n')

  return html.trim()
}

/**
 * Extract headings from content for table of contents
 */
export function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = []
  const regex = /<h([2-4])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[2-4]>/gi
  let match

  while ((match = regex.exec(content)) !== null) {
    const level = parseInt(match[1])
    const id = match[2]
    const text = match[3].replace(/<[^>]+>/g, '')
    headings.push({ id, text, level })
  }

  // If no IDs, generate them from headings
  if (headings.length === 0) {
    const regex2 = /<h([2-4])[^>]*>(.*?)<\/h[2-4]>/gi
    while ((match = regex2.exec(content)) !== null) {
      const level = parseInt(match[1])
      const text = match[2].replace(/<[^>]+>/g, '')
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 50)
      headings.push({ id, text, level })
    }
  }

  return headings.slice(0, 8) // max 8 items in TOC
}
