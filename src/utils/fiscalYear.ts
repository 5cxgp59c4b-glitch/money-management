export function getFiscalYear(dateStr: string): number {
  const year = parseInt(dateStr.slice(0, 4), 10)
  const month = parseInt(dateStr.slice(5, 7), 10)
  return month >= 4 ? year : year - 1
}

export function getCurrentFiscalYear(): number {
  const d = new Date()
  return d.getMonth() + 1 >= 4 ? d.getFullYear() : d.getFullYear() - 1
}

export function getFiscalYearMonths(fy: number): string[] {
  const months: string[] = []
  for (let m = 4; m <= 12; m++) months.push(`${fy}-${String(m).padStart(2, '0')}`)
  for (let m = 1; m <= 3; m++) months.push(`${fy + 1}-${String(m).padStart(2, '0')}`)
  return months
}
