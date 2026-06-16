import { Controller, Post, Body } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('analyze')
  analyze(@Body('text') text: string): { franjaHoraria: number[] } {
    return { franjaHoraria: this.whatsappService.getFranjaHoraria(text) };
  }
  @Post('word-cloud')
  getWordCloud(@Body('text') text: string): { text: string; count: number }[] {
    return this.whatsappService.getWordCloud(text);
  }
}
