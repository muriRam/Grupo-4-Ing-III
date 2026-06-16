import { Injectable } from '@nestjs/common';
import { parseMessages, ParsedMessage } from './whatsapp-parser';

@Injectable()
export class MensajesPorUsuarioService {
  // Recibe el texto del chat, lo parsea y devuelve los datos de mensajes por usuario.
  analizar(chat: string) {
    const messages = parseMessages(chat ?? '');
    return {
      mensajesPorUsuario: this.getMensajesPorUsuario(messages),
      usuarioQueMasEnvio: this.getUsuarioQueMasEnvio(messages),
      usuarioQueMenosEnvio: this.getUsuarioQueMenosEnvio(messages),
    };
  }

  // Cuenta cuántos mensajes envió cada usuario y los ordena de mayor a menor.
  getMensajesPorUsuario(
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
  getUsuarioQueMasEnvio(
    messages: ParsedMessage[],
  ): { usuario: string; cantidad: number } | null {
    const conteo = this.getMensajesPorUsuario(messages);
    if (conteo.length === 0) return null;
    return conteo[0];
  }

  // Usuario que menos mensajes envió (el último de la lista ordenada).
  getUsuarioQueMenosEnvio(
    messages: ParsedMessage[],
  ): { usuario: string; cantidad: number } | null {
    const conteo = this.getMensajesPorUsuario(messages);
    if (conteo.length === 0) return null;
    return conteo[conteo.length - 1];
  }
}
