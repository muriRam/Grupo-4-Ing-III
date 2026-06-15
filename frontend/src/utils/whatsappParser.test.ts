import { describe, expect, it } from 'vitest'
import {
  parseMessages,
  getMensajesPorUsuario,
  getUsuarioQueMasEnvio,
  getUsuarioQueMenosEnvio,
} from './whatsappParser'

// Chat de ejemplo: Juan envía 3 mensajes, Maria 2 y Pedro 1.
const chatEjemplo = [
  '15/3/2024, 14:30 - Juan: Hola',
  '15/3/2024, 14:31 - Maria: Buenas',
  '15/3/2024, 14:32 - Juan: Como va?',
  '15/3/2024, 14:33 - Juan: Todo bien?',
  '15/3/2024, 14:34 - Maria: Si',
  '15/3/2024, 14:35 - Pedro: Hola a todos',
].join('\n')

describe('getMensajesPorUsuario', () => {
  it('cuenta cuántos mensajes envió cada usuario', () => {
    const mensajes = parseMessages(chatEjemplo)
    expect(getMensajesPorUsuario(mensajes)).toEqual([
      { usuario: 'Juan', cantidad: 3 },
      { usuario: 'Maria', cantidad: 2 },
      { usuario: 'Pedro', cantidad: 1 },
    ])
  })

  it('devuelve la lista ordenada de mayor a menor', () => {
    const mensajes = parseMessages(chatEjemplo)
    const resultado = getMensajesPorUsuario(mensajes)
    expect(resultado[0].usuario).toBe('Juan')
    expect(resultado[resultado.length - 1].usuario).toBe('Pedro')
  })

  it('devuelve una lista vacía si no hay mensajes', () => {
    expect(getMensajesPorUsuario([])).toEqual([])
  })
})

describe('getUsuarioQueMasEnvio', () => {
  it('devuelve el usuario que más mensajes envió', () => {
    const mensajes = parseMessages(chatEjemplo)
    expect(getUsuarioQueMasEnvio(mensajes)).toEqual({ usuario: 'Juan', cantidad: 3 })
  })

  it('devuelve null si no hay mensajes', () => {
    expect(getUsuarioQueMasEnvio([])).toBeNull()
  })
})

describe('getUsuarioQueMenosEnvio', () => {
  it('devuelve el usuario que menos mensajes envió', () => {
    const mensajes = parseMessages(chatEjemplo)
    expect(getUsuarioQueMenosEnvio(mensajes)).toEqual({ usuario: 'Pedro', cantidad: 1 })
  })

  it('devuelve null si no hay mensajes', () => {
    expect(getUsuarioQueMenosEnvio([])).toBeNull()
  })
})
