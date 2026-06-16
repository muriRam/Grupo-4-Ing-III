import { Controller, Post, Body } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('analyze')
  analyze(@Body('text') text: string): { franjaHoraria: number[] } {
    return { franjaHoraria: this.whatsappService.getFranjaHoraria(text) };
  }
}
