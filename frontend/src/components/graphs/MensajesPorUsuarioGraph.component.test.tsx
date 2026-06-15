import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('chart.js', () => ({
  Chart: class {
    constructor() {}
    destroy() {}
    static register() {}
  },
  registerables: [],
}))

import { MensajesPorUsuarioGraph } from './MensajesPorUsuarioGraph.component'

const mockData = [
  { usuario: 'Juan', cantidad: 30 },
  { usuario: 'Maria', cantidad: 20 },
  { usuario: 'Pedro', cantidad: 10 },
]

describe('MensajesPorUsuarioGraph', () => {
  it('renderiza un canvas donde se dibuja el gráfico', () => {
    const { container } = render(<MensajesPorUsuarioGraph data={mockData} />)
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })

  it('al desmontarse limpia el gráfico sin lanzar errores', () => {
    const { unmount } = render(<MensajesPorUsuarioGraph data={mockData} />)
    expect(() => unmount()).not.toThrow()
  })
})
