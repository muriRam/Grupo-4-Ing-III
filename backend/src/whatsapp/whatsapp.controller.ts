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

  @Post('emojis')
  emojis(@Body('text') text: string): { emojis: { emoji: string; count: number }[] } {
    return { emojis: this.whatsappService.getEmojisMasUsados(text) };
  }

  @Post('dias-semana')
  diasSemana(@Body('text') text: string): { diasSemana: number[] } {
    return { diasSemana: this.whatsappService.getDiasSemana(text) };
  }
}
