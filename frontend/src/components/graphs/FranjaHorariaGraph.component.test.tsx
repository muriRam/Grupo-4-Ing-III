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

import { FranjaHorariaGraph } from './FranjaHorariaGraph.component'

const mockData = new Array(24).fill(0)

describe('FranjaHorariaGraph', () => {
  it('renderiza un canvas donde se dibuja el gráfico', () => {
    const { container } = render(<FranjaHorariaGraph data={mockData} />)
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })

  it('al desmontarse limpia el gráfico sin lanzar errores', () => {
    const { unmount } = render(<FranjaHorariaGraph data={mockData} />)
    expect(() => unmount()).not.toThrow()
  })
})
