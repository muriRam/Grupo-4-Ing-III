export const isWhatsappExportLine = (line: string): boolean => {
  const trimmedLine = line.replace(/^﻿/, '').trim()
  return /^\d{1,2}\/\d{1,2}\/\d{4}, \d{2}:\d{2} - /.test(trimmedLine)
}

export const hasValidWhatsappLine = (text: string): boolean => {
  const lines = text.split(/\r?\n/).slice(0, 120)
  return lines.some((line) => isWhatsappExportLine(line))
}
