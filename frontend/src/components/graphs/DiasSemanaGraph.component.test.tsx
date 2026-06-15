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

import { DiasSemanaGraph } from './DiasSemanaGraph.component'

const mockData = [10, 20, 30, 25, 40, 15, 5]

describe('DiasSemanaGraph', () => {
  it('renderiza un canvas donde se dibuja el gráfico', () => {
    const { container } = render(<DiasSemanaGraph data={mockData} />)
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })

  it('al desmontarse limpia el gráfico sin lanzar errores', () => {
    const { unmount } = render(<DiasSemanaGraph data={mockData} />)
    expect(() => unmount()).not.toThrow()
  })
})
