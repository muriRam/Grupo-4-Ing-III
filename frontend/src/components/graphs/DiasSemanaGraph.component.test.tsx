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

describe('DiasSemanaGraph', () => {
  it('renderiza un canvas donde se dibuja el gráfico', () => {
    const { container } = render(<DiasSemanaGraph />)
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })

  it('al desmontarse limpia el gráfico sin lanzar errores', () => {
    const { unmount } = render(<DiasSemanaGraph />)
    expect(() => unmount()).not.toThrow()
  })
})
