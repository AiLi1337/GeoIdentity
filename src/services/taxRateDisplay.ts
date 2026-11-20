export function formatTaxRate(
  rawTaxRate: string | undefined,
  isTaxFree: boolean | undefined,
  locale: 'zh' | 'en'
): string {
  const raw = rawTaxRate?.trim() || '';
  const percentages = [...raw.matchAll(/(\d+(?:\.\d+)?)%/g)].map(match => Number(match[1]));
  const hasPositiveTaxRate = percentages.some(rate => rate > 0);

  if (hasPositiveTaxRate) return raw;

  const explicitlyZeroTax = Boolean(raw) &&
    (/0(?:\.0+)?%/.test(raw) || raw.includes('No Sales Tax') || raw.includes('免税') || /tax[- ]free/i.test(raw));

  if (locale === 'zh') {
    if (raw.includes('Standard Tax') || raw.includes('标准')) return '标准消费税率';
    if (explicitlyZeroTax || (!raw && isTaxFree)) return '0.00% (免消费税)';
    return raw || '0.00% (免消费税)';
  }

  if (raw.includes('标准') || raw.includes('Standard Tax')) return 'Standard Tax';
  if (explicitlyZeroTax || (!raw && isTaxFree)) return '0.00% (No Sales Tax)';
  return raw || '0.00% (No Sales Tax)';
}
