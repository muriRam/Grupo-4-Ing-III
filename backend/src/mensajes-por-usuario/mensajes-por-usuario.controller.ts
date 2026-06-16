import { Body, Controller, Post } from '@nestjs/common';
import { MensajesPorUsuarioService } from './mensajes-por-usuario.service';

@Controller('mensajes-por-usuario')
export class MensajesPorUsuarioController {
  constructor(private readonly service: MensajesPorUsuarioService) {}

  // Recibe el texto del chat exportado y devuelve los datos de mensajes por usuario.
  @Post()
  analizar(@Body() body: { chat: string }) {
    return this.service.analizar(body.chat);
  }
}
