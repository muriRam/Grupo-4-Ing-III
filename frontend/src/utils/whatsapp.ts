export const isWhatsappExportLine = (line: string): boolean => {
  const trimmedLine = line.replace(/^\uFEFF/, '').trim()
  return /^\d{1,2}\/\d{1,2}\/\d{2,4}, \d{1,2}:\d{2}\s?([AaPp][Mm])? - /.test(trimmedLine)
}

export const hasValidWhatsappLine = (text: string): boolean => {
  const lines = text.split(/\r?\n/).slice(0, 120)
  return lines.some((line) => isWhatsappExportLine(line))
}
