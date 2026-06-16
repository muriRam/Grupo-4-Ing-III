import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MensajesPorUsuarioController } from './mensajes-por-usuario/mensajes-por-usuario.controller';
import { MensajesPorUsuarioService } from './mensajes-por-usuario/mensajes-por-usuario.service';

@Module({
  imports: [],
  controllers: [AppController, MensajesPorUsuarioController],
  providers: [AppService, MensajesPorUsuarioService],
})
export class AppModule {}
