export interface ParsedMessage {
  date: Date
  hora: number
  diaSemana: number
  usuario: string
  mensaje: string
}

export interface ChatData {
  franjaHoraria: number[]
}

const MESSAGE_REGEX = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4}), (\d{1,2}):(\d{2})\s?([AaPp][Mm])? - ([^:\r\n]+): (.*)/
const DATE_PREFIX_REGEX = /^\d{1,2}\/\d{1,2}\/\d{4}, \d{2}:\d{2} - /
function a24Horas(hora: number, ampm: string | undefined): number {
  if (!ampm) return hora
  const h = hora % 12
  return ampm.toLowerCase().startsWith('a') ? h : h + 12
}

export function parseMessages(text: string): ParsedMessage[] {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/)
  const messages: ParsedMessage[] = []

  for (const line of lines) {
    const match = line.match(MESSAGE_REGEX)
    if (match) {
      const [, day, month, year, hour, , ampm, usuario, mensaje] = match
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      messages.push({
        date,
        hora: a24Horas(parseInt(hour), ampm),
        diaSemana: (date.getDay() + 6) % 7,
        usuario: usuario.trim(),
        mensaje,
      })
      continue
    }

    if (DATE_PREFIX_REGEX.test(line)) continue

    if (messages.length > 0) {
      messages[messages.length - 1].mensaje += '\n' + line
    }
  }

  return messages
}

export function getFranjaHoraria(messages: ParsedMessage[]): number[] {
  const counts = new Array<number>(24).fill(0)
  for (const msg of messages) {
    counts[msg.hora]++
  }
  return counts
}

export function buildChatData(text: string): ChatData {
  const messages = parseMessages(text)
  return {
    franjaHoraria: getFranjaHoraria(messages),
  }
}

