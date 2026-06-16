import { Injectable } from '@nestjs/common';

interface ParsedMessage {
  hora: number;
  mensaje: string;
}

const MESSAGE_REGEX =
  /^(\d{1,2})\/(\d{1,2})\/(\d{2,4}), (\d{1,2}):(\d{2})\s?([AaPp][Mm])? - ([^:\r\n]+): (.*)/;
const DATE_PREFIX_REGEX = /^\d{1,2}\/\d{1,2}\/\d{4}, \d{2}:\d{2} - /;

function to24Hours(hora: number, ampm: string | undefined): number {
  if (!ampm) return hora;
  const h = hora % 12;
  return ampm.toLowerCase().startsWith('a') ? h : h + 12;
}

@Injectable()
export class WhatsappService {
  parseMessages(text: string): ParsedMessage[] {
    const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/);
    const messages: ParsedMessage[] = [];

    for (const line of lines) {
      const match = line.match(MESSAGE_REGEX);
      if (match) {
        const [, , , , hour, , ampm, , mensaje] = match;
        messages.push({ hora: to24Hours(parseInt(hour), ampm), mensaje });
        continue;
      }

      if (DATE_PREFIX_REGEX.test(line)) continue;
    }

    return messages;
  }

  getFranjaHoraria(text: string): number[] {
    const messages = this.parseMessages(text);
    const counts = new Array<number>(24).fill(0);
    for (const msg of messages) {
      counts[msg.hora]++;
    }
    return counts;
  }

  getEmojisMasUsados(text: string): { emoji: string; count: number }[] {
    const messages = this.parseMessages(text);
    const emojiRegex = /\p{Extended_Pictographic}/gu;
    const counts = new Map<string, number>();

    for (const msg of messages) {
      if (!msg.mensaje) continue;
      const matches = msg.mensaje.match(emojiRegex);
      if (!matches) continue;
      for (const e of matches) {
        counts.set(e, (counts.get(e) || 0) + 1);
      }
    }

    return Array.from(counts.entries())
      .map(([emoji, count]) => ({ emoji, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}
