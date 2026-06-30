/**
 * Rozpozná, či OpenAI chyba je o minutom kredite / limite, a vráti zrozumiteľnú
 * slovenskú hlášku. Inak vráti '' (nie je to kreditová chyba).
 */
export function quotaMessage(e: any): string {
  const code = e?.code || e?.error?.code || ''
  const status = e?.status || e?.statusCode || 0
  const msg = String(e?.message || e?.error?.message || '')
  if (code === 'insufficient_quota' || /insufficient_quota|exceeded your current quota|billing/i.test(msg)) {
    return 'Minul sa kredit na OpenAI účte. Doplň kredit (platform.openai.com → Billing) a generovanie bude opäť fungovať.'
  }
  if (status === 429 || /rate limit/i.test(msg)) {
    return 'OpenAI dočasne obmedzil počet požiadaviek (rate limit). Skús o chvíľu znova.'
  }
  if (code === 'invalid_api_key' || status === 401 || /invalid api key|incorrect api key/i.test(msg)) {
    return 'OpenAI API kľúč je neplatný. Skontroluj ho v Integráciách.'
  }
  return ''
}

export function isQuotaError(e: any): boolean {
  return !!quotaMessage(e)
}
