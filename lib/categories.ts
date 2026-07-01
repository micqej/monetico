export const CATEGORIES = [
  'Marketing Tipy', 'Podnikanie', 'O eshopoch', 'Ako na to', 'Analýza',
  'Email', 'SEO', 'WordPress', 'O weboch', 'Sociálne siete',
  'AI', 'Reklama', 'Novinky',
]

/** Náhodná kategória zo zoznamu (index od indexu kvôli determinizmu vo workflowoch netreba — toto je server). */
export function randomCategoryFrom(seed: number): string {
  return CATEGORIES[seed % CATEGORIES.length]
}
