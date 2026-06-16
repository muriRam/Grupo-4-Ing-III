export interface ParsedMessage {
  date: Date;
  hora: number;
  diaSemana: number;
  usuario: string;
  mensaje: string;
}

// Formato Android: 22/6/2024, 13:27 - Usuario: mensaje
const ANDROID_REGEX =
  /^(\d{1,2})\/(\d{1,2})\/(\d{2,4}), (\d{1,2}):(\d{2})\s?([AaPp][Mm])? - ([^:\r\n]+): (.*)/;
// Formato iPhone: [22/6/24, 13:27:54] Usuario: mensaje
const IPHONE_REGEX =
  /^\[(\d{1,2})\/(\d{1,2})\/(\d{2,4}), (\d{1,2}):(\d{2})(?::\d{2})?\s?([AaPp][Mm])?\] ([^:]+): (.*)/;
// Línea de sistema de Android (tiene fecha pero no un "usuario:"), se ignora.
const ANDROID_SYSTEM_REGEX = /^\d{1,2}\/\d{1,2}\/\d{2,4}, \d{1,2}:\d{2}.* - /;

// U+200E y U+200F son marcas invisibles que WhatsApp agrega al inicio de
// algunas líneas y mensajes automáticos.
function esMarca(code: number): boolean {
  return code === 0x200e || code === 0x200f;
}

function sacarMarcasIniciales(linea: string): string {
  let i = 0;
  while (i < linea.length && esMarca(linea.charCodeAt(i))) i++;
  return i > 0 ? linea.slice(i) : linea;
}

// Mensajes que genera WhatsApp solo (no los manda un usuario). Se ignoran.
// Los multimedia (audio/imagen/sticker omitido) NO entran acá: sí se cuentan.
function esMensajeDeSistema(mensaje: string): boolean {
  const m = mensaje.toLowerCase();
  return (
    m.includes('los mensajes y las llamadas están cifrados') ||
    m.includes('creó este grupo') ||
    m.includes('creó el grupo') ||
    m.includes('te añadió') ||
    m.includes('añadió a') ||
    m.includes('salió del grupo') ||
    m.includes('saliste del grupo') ||
    m.includes('eliminó a') ||
    m.includes('te eliminó') ||
    m.includes('cambió el asunto') ||
    m.includes('cambió el ícono') ||
    m.includes('cambió la descripción') ||
    m.includes('cambió tu código de seguridad') ||
    m.includes('ahora es admin') ||
    m.includes('ahora eres admin')
  );
}

function a24Horas(hora: number, ampm: string | undefined): number {
  if (!ampm) return hora;
  const h = hora % 12;
  return ampm.toLowerCase().startsWith('a') ? h : h + 12;
}

function armarMensaje(
  day: string,
  month: string,
  year: string,
  hour: string,
  ampm: string | undefined,
  usuario: string,
  mensaje: string,
): ParsedMessage {
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return {
    date,
    hora: a24Horas(parseInt(hour), ampm),
    diaSemana: (date.getDay() + 6) % 7,
    usuario: usuario.trim(),
    mensaje,
  };
}

export function parseMessages(text: string): ParsedMessage[] {
  // Saca el BOM (U+FEFF) que algunos sistemas agregan al inicio del archivo.
  const limpio = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const lines = limpio.split(/\r?\n/);
  const messages: ParsedMessage[] = [];

  for (const line of lines) {
    const clean = sacarMarcasIniciales(line);

    // Formato Android
    const android = clean.match(ANDROID_REGEX);
    if (android) {
      const [, day, month, year, hour, , ampm, usuario, mensaje] = android;
      messages.push(armarMensaje(day, month, year, hour, ampm, usuario, mensaje));
      continue;
    }

    // Formato iPhone
    const iphone = clean.match(IPHONE_REGEX);
    if (iphone) {
      const [, day, month, year, hour, , ampm, usuario, mensaje] = iphone;
      const texto = sacarMarcasIniciales(mensaje);
      // Salteamos solo los mensajes del sistema; los multimedia sí se cuentan.
      if (esMensajeDeSistema(texto)) continue;
      messages.push(armarMensaje(day, month, year, hour, ampm, usuario, texto));
      continue;
    }

    // Línea de sistema de Android (sin usuario): se ignora.
    if (ANDROID_SYSTEM_REGEX.test(clean)) continue;

    // Si no es ninguna de las anteriores, es continuación del mensaje anterior.
    if (messages.length > 0) {
      messages[messages.length - 1].mensaje += '\n' + line;
    }
  }

  return messages;
}
