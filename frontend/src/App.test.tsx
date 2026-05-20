import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

// chart.js no funciona en jsdom (no hay canvas real). Lo reemplazamos
// por una clase vacía: alcanza con verificar que el componente se renderiza.
vi.mock('chart.js', () => ({
  Chart: class {
    constructor() {}
    destroy() {}
    static register() {}
  },
  registerables: [],
}))

// FileUpload tiene su propia lógica de validación (testeada en utils/whatsapp.test.ts).
// Acá lo reemplazamos por un botón simple que dispara onContinue, así podemos
// testear directamente la transición a la vista del dashboard.
vi.mock('./FileUpload', () => ({
  default: ({ onContinue }: { onContinue: () => void }) => (
    <button type="button" onClick={onContinue}>continuar a dashboard</button>
  ),
}))

import App from './App'

describe('App (Dashboard Inicial)', () => {
  it('al iniciar muestra la pantalla de carga de archivo', () => {
    render(<App />)
    expect(
      screen.getByRole('button', { name: /continuar a dashboard/i })
    ).toBeInTheDocument()
  })

  it('al iniciar todavía no muestra el dashboard', () => {
    render(<App />)
    expect(
      screen.queryByRole('heading', { level: 1, name: /bienvenido/i })
    ).not.toBeInTheDocument()
  })

  it('al continuar muestra el título principal del dashboard', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /continuar a dashboard/i }))
    expect(
      screen.getByRole('heading', { level: 1, name: /bienvenido a su chat review/i })
    ).toBeInTheDocument()
  })

  it('al continuar muestra las 5 secciones del dashboard', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /continuar a dashboard/i }))

    expect(screen.getByRole('heading', { name: /nube de palabras/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /mensajes por usuario/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /franja horaria/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /emojis/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /dia de la semana/i })).toBeInTheDocument()
  })

  it('al continuar renderiza un canvas por cada gráfico (5 en total)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /continuar a dashboard/i }))

    // 4 gráficos hechos con chart.js + 1 nube de palabras (canvas propio) = 5
    const canvases = document.querySelectorAll('canvas')
    expect(canvases.length).toBe(5)
  })
})
