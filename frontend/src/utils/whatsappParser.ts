export interface ParsedMessage {
  date: Date;
  hora: number;
  diaSemana: number;
  usuario: string;
  mensaje: string;
}

export interface ChatData {
  franjaHoraria: number[];
  wordCloud: { text: string; count: number }[];
  emojisMasUsados: { emoji: string; count: number }[];
  diasSemana: number[];
}

const MESSAGE_REGEX =
  /^(\d{1,2})\/(\d{1,2})\/(\d{2,4}), (\d{1,2}):(\d{2})\s?([AaPp][Mm])? - ([^:\r\n]+): (.*)/;
const DATE_PREFIX_REGEX = /^\d{1,2}\/\d{1,2}\/\d{4}, \d{2}:\d{2} - /;
function a24Horas(hora: number, ampm: string | undefined): number {
  if (!ampm) return hora;
  const h = hora % 12;
  return ampm.toLowerCase().startsWith("a") ? h : h + 12;
}

export function parseMessages(text: string): ParsedMessage[] {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/);
  const messages: ParsedMessage[] = [];

  for (const line of lines) {
    const match = line.match(MESSAGE_REGEX);
    if (match) {
      const [, day, month, year, hour, , ampm, usuario, mensaje] = match;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      messages.push({
        date,
        hora: a24Horas(parseInt(hour), ampm),
        diaSemana: (date.getDay() + 6) % 7,
        usuario: usuario.trim(),
        mensaje,
      });
      continue;
    }

    if (DATE_PREFIX_REGEX.test(line)) continue;

    if (messages.length > 0) {
      messages[messages.length - 1].mensaje += "\n" + line;
    }
  }

  return messages;
}

export function getFranjaHoraria(messages: ParsedMessage[]): number[] {
  const counts = new Array<number>(24).fill(0);
  for (const msg of messages) {
    counts[msg.hora]++;
  }
  return counts;
}

export function getWordCloud(
  messages: ParsedMessage[],
): { text: string; count: number }[] {
  // Une todos los mensajes en un solo string separado por espacios
  const allText = messages.map((m) => m.mensaje).join(" ");
  // Elimina signos de puntuación reemplazándolos por espacios y convierte a minúsculas
  const cleaned = allText
    .replace(/[".,!?;:\-()\[\]{}<>\/\\=+*&^%$#@~`|«»—–…¿¡]/g, " ")
    .toLowerCase();
  // Separa en palabras cortando por espacios en blanco
  const words = cleaned.split(/\s+/).map((w) => w.trim());

  const freq = new Map<string, number>();
  for (const w of words) {
    // Descarta vacíos, palabras cortas y tokens numéricos
    if (!w) continue;
    if (w.length < 3) continue;
    if (/^\d+$/.test(w)) continue;
    // Suma 1 a la frecuencia de la palabra, o la inicializa en 1
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  // Convierte el Map a array de objetos { text, count }
  const arr = Array.from(freq.entries()).map(([text, count]) => ({
    text,
    count,
  }));
  arr.sort((a, b) => b.count - a.count);
  return arr.slice(0, 50);
}

export function getEmojisMasUsados(
  messages: ParsedMessage[],
): { emoji: string; count: number }[] {
  const emojiRegex = /\p{Extended_Pictographic}/gu;
  const allEmojis = messages.flatMap((m) => m.mensaje.match(emojiRegex) || []);

  const freq = new Map<string, number>();
  for (const emoji of allEmojis) {
    freq.set(emoji, (freq.get(emoji) || 0) + 1);
  }

  const arr = Array.from(freq.entries()).map(([emoji, count]) => ({
    emoji,
    count,
  }));
  arr.sort((a, b) => b.count - a.count);
  return arr.slice(0, 10);
}

export function getDiasSemana(messages: ParsedMessage[]): number[] {
  const counts = new Array<number>(7).fill(0);
  for (const msg of messages) {
    counts[msg.diaSemana]++;
  }
  return counts;
}

// Cuenta cuántos mensajes envió cada usuario y los ordena de mayor a menor.
export function getMensajesPorUsuario(
  messages: ParsedMessage[],
): { usuario: string; cantidad: number }[] {
  const conteo = new Map<string, number>();
  for (const msg of messages) {
    conteo.set(msg.usuario, (conteo.get(msg.usuario) || 0) + 1);
  }

  const arr = Array.from(conteo.entries()).map(([usuario, cantidad]) => ({
    usuario,
    cantidad,
  }));
  arr.sort((a, b) => b.cantidad - a.cantidad);
  return arr;
}

// Usuario que más mensajes envió (el primero de la lista ordenada).
export function getUsuarioQueMasEnvio(
  messages: ParsedMessage[],
): { usuario: string; cantidad: number } | null {
  const conteo = getMensajesPorUsuario(messages);
  if (conteo.length === 0) return null;
  return conteo[0];
}

// Usuario que menos mensajes envió (el último de la lista ordenada).
export function getUsuarioQueMenosEnvio(
  messages: ParsedMessage[],
): { usuario: string; cantidad: number } | null {
  const conteo = getMensajesPorUsuario(messages);
  if (conteo.length === 0) return null;
  return conteo[conteo.length - 1];
}

export function buildChatData(text: string): ChatData {
  const messages = parseMessages(text);
  return {
    franjaHoraria: getFranjaHoraria(messages),
    wordCloud: getWordCloud(messages),
    emojisMasUsados: getEmojisMasUsados(messages),
    diasSemana: getDiasSemana(messages),
  };
}
