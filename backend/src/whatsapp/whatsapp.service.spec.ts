import { WhatsappService } from './whatsapp.service';

describe('WhatsappService', () => {
  let service: WhatsappService;

  beforeEach(() => {
    service = new WhatsappService();
  });

  describe('parseMessages', () => {
    it('parsea un mensaje con formato de 24 horas', () => {
      const text = '15/3/2024, 14:30 - Juan: Hola';
      const messages = service.parseMessages(text);
      expect(messages).toHaveLength(1);
      expect(messages[0].hora).toBe(14);
    });

    it('parsea un mensaje con formato AM', () => {
      const text = '15/3/2024, 9:05 AM - María: Buenos días';
      const messages = service.parseMessages(text);
      expect(messages).toHaveLength(1);
      expect(messages[0].hora).toBe(9);
    });

    it('parsea un mensaje con formato PM', () => {
      const text = '15/3/2024, 3:00 PM - Pedro: Buenas tardes';
      const messages = service.parseMessages(text);
      expect(messages).toHaveLength(1);
      expect(messages[0].hora).toBe(15);
    });

    it('convierte las 12 AM a hora 0', () => {
      const text = '15/3/2024, 12:00 AM - Juan: Medianoche';
      const messages = service.parseMessages(text);
      expect(messages[0].hora).toBe(0);
    });

    it('convierte las 12 PM a hora 12', () => {
      const text = '15/3/2024, 12:00 PM - Juan: Mediodía';
      const messages = service.parseMessages(text);
      expect(messages[0].hora).toBe(12);
    });

    it('parsea múltiples mensajes', () => {
      const text = [
        '15/3/2024, 8:00 - Juan: Buenos días',
        '15/3/2024, 20:00 - María: Buenas noches',
      ].join('\n');
      const messages = service.parseMessages(text);
      expect(messages).toHaveLength(2);
      expect(messages[0].hora).toBe(8);
      expect(messages[1].hora).toBe(20);
    });

    it('ignora las líneas del sistema (sin usuario)', () => {
      const text = [
        '15/3/2024, 14:30 - Los mensajes y las llamadas están cifrados',
        '15/3/2024, 14:31 - Juan: Hola',
      ].join('\n');
      const messages = service.parseMessages(text);
      expect(messages).toHaveLength(1);
    });

    it('elimina el BOM al inicio del texto', () => {
      const text = '﻿15/3/2024, 10:00 - Juan: Hola';
      const messages = service.parseMessages(text);
      expect(messages).toHaveLength(1);
    });

    it('retorna un array vacío para texto sin mensajes', () => {
      expect(service.parseMessages('')).toHaveLength(0);
      expect(service.parseMessages('texto sin formato')).toHaveLength(0);
    });
  });

  describe('getFranjaHoraria', () => {
    it('retorna un array de 24 posiciones', () => {
      const result = service.getFranjaHoraria('');
      expect(result).toHaveLength(24);
    });

    it('cuenta correctamente los mensajes por hora', () => {
      const text = [
        '15/3/2024, 8:00 - Juan: Mensaje 1',
        '15/3/2024, 8:30 - María: Mensaje 2',
        '15/3/2024, 20:00 - Pedro: Mensaje 3',
      ].join('\n');
      const result = service.getFranjaHoraria(text);
      expect(result[8]).toBe(2);
      expect(result[20]).toBe(1);
    });

    it('inicializa todas las horas en 0 cuando no hay mensajes', () => {
      const result = service.getFranjaHoraria('');
      expect(result.every((count) => count === 0)).toBe(true);
    });

    it('acumula mensajes de múltiples días en la misma hora', () => {
      const text = [
        '15/3/2024, 10:00 - Juan: Lunes',
        '16/3/2024, 10:15 - Juan: Martes',
        '17/3/2024, 10:45 - Juan: Miércoles',
      ].join('\n');
      const result = service.getFranjaHoraria(text);
      expect(result[10]).toBe(3);
    });
  });
});
