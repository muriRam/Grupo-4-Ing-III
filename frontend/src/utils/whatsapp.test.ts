import { describe, expect, it } from 'vitest'
import { hasValidWhatsappLine, isWhatsappExportLine } from './whatsapp'

describe('isWhatsappExportLine', () => {
  it('reconoce una línea válida con formato DD/MM/YYYY', () => {
    expect(isWhatsappExportLine('15/3/2024, 14:30 - Juan: Hola')).toBe(true)
  })

  it('reconoce una línea válida con día de dos dígitos', () => {
    expect(isWhatsappExportLine('01/12/2023, 09:05 - María: Buenos días')).toBe(true)
  })

  it('rechaza una línea sin el separador " - "', () => {
    expect(isWhatsappExportLine('15/3/2024, 14:30 Juan: Hola')).toBe(false)
  })

  it('rechaza una línea con formato de fecha incorrecto', () => {
    expect(isWhatsappExportLine('2024-03-15 14:30 - Juan: Hola')).toBe(false)
  })

  it('rechaza una línea de texto plano', () => {
    expect(isWhatsappExportLine('Este es un archivo de texto normal')).toBe(false)
  })

  it('rechaza una línea vacía', () => {
    expect(isWhatsappExportLine('')).toBe(false)
  })

  it('elimina el BOM (\\uFEFF) antes de validar', () => {
    expect(isWhatsappExportLine('﻿15/3/2024, 14:30 - Juan: Hola')).toBe(true)
  })
})

describe('hasValidWhatsappLine', () => {
  it('acepta un texto con una línea válida de WhatsApp', () => {
    const text = '15/3/2024, 14:30 - Juan: Hola\n15/3/2024, 14:31 - María: Hola!'
    expect(hasValidWhatsappLine(text)).toBe(true)
  })

  it('acepta aunque la línea válida no sea la primera', () => {
    const text = 'Los mensajes y las llamadas están cifrados...\n15/3/2024, 14:30 - Juan: Hola'
    expect(hasValidWhatsappLine(text)).toBe(true)
  })

  it('rechaza un texto sin ninguna línea con formato WhatsApp', () => {
    const text = 'Este es un archivo\nde texto normal\nsin formato WhatsApp'
    expect(hasValidWhatsappLine(text)).toBe(false)
  })

  it('rechaza un texto vacío', () => {
    expect(hasValidWhatsappLine('')).toBe(false)
  })

  it('solo revisa las primeras 120 líneas', () => {
    const lineasVacias = Array(120).fill('texto sin formato').join('\n')
    const textConLineaValidaFuera = lineasVacias + '\n15/3/2024, 14:30 - Juan: Hola'
    expect(hasValidWhatsappLine(textConLineaValidaFuera)).toBe(false)
  })
})
