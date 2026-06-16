import { MensajesPorUsuarioService } from './mensajes-por-usuario.service';

describe('MensajesPorUsuarioService', () => {
  const service = new MensajesPorUsuarioService();
  const lrm = String.fromCharCode(0x200e); // marca de WhatsApp en mensajes automáticos

  // Chat de ejemplo: Juan envía 3 mensajes, Maria 2 y Pedro 1.
  const chat = [
    '15/3/2024, 14:30 - Juan: Hola',
    '15/3/2024, 14:31 - Maria: Buenas',
    '15/3/2024, 14:32 - Juan: Como va?',
    '15/3/2024, 14:33 - Juan: Todo bien?',
    '15/3/2024, 14:34 - Maria: Si',
    '15/3/2024, 14:35 - Pedro: Hola a todos',
  ].join('\n');

  it('cuenta los mensajes por usuario ordenados de mayor a menor', () => {
    const r = service.analizar(chat);
    expect(r.mensajesPorUsuario).toEqual([
      { usuario: 'Juan', cantidad: 3 },
      { usuario: 'Maria', cantidad: 2 },
      { usuario: 'Pedro', cantidad: 1 },
    ]);
  });

  it('devuelve el usuario que más y el que menos envió', () => {
    const r = service.analizar(chat);
    expect(r.usuarioQueMasEnvio).toEqual({ usuario: 'Juan', cantidad: 3 });
    expect(r.usuarioQueMenosEnvio).toEqual({ usuario: 'Pedro', cantidad: 1 });
  });

  it('con un chat vacío devuelve listas vacías y null', () => {
    const r = service.analizar('');
    expect(r.mensajesPorUsuario).toEqual([]);
    expect(r.usuarioQueMasEnvio).toBeNull();
    expect(r.usuarioQueMenosEnvio).toBeNull();
  });

  it('también entiende el formato iPhone (con corchetes y segundos)', () => {
    const chatIphone = [
      '[22/6/24, 13:27:54] Juan: Hola',
      '[22/6/24, 13:28:10] Maria: Buenas',
      '[22/6/24, 13:29:00] Juan: Todo bien?',
    ].join('\n');
    const r = service.analizar(chatIphone);
    expect(r.mensajesPorUsuario).toEqual([
      { usuario: 'Juan', cantidad: 2 },
      { usuario: 'Maria', cantidad: 1 },
    ]);
  });

  it('cuenta los multimedia pero ignora los mensajes del sistema (formato iPhone)', () => {
    const chat = [
      '[22/6/24, 13:27:54] Grupo: ' + lrm + 'Los mensajes y las llamadas están cifrados de extremo a extremo.',
      '[22/6/24, 13:27:55] Grupo: ' + lrm + 'Martin te añadió',
      lrm + '[22/6/24, 13:28:00] Juan: ' + lrm + 'audio omitido',
      '[22/6/24, 13:29:00] Juan: Hola de verdad',
      '[22/6/24, 13:30:00] Maria: ' + lrm + 'sticker omitido',
    ].join('\n');
    const r = service.analizar(chat);
    expect(r.mensajesPorUsuario).toEqual([
      { usuario: 'Juan', cantidad: 2 },
      { usuario: 'Maria', cantidad: 1 },
    ]);
  });
});
