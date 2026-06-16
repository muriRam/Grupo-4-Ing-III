import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { MensajesPorUsuarioController } from './mensajes-por-usuario/mensajes-por-usuario.controller';
import { MensajesPorUsuarioService } from './mensajes-por-usuario/mensajes-por-usuario.service';

@Module({
  imports: [WhatsappModule],
  controllers: [AppController, MensajesPorUsuarioController],
  providers: [AppService, MensajesPorUsuarioService],
})
export class AppModule {}
