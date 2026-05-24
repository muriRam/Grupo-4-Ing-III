import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WordCloud } from './WordCloud.component'

describe('WordCloud', () => {
  it('renderiza un canvas cuando recibe una lista de palabras', () => {
    const palabras = [
      { text: 'hola', count: 5 },
      { text: 'chau', count: 3 },
    ]
    const { container } = render(<WordCloud words={palabras} />)
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })

  it('renderiza un canvas aunque la lista de palabras esté vacía', () => {
    const { container } = render(<WordCloud words={[]} />)
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })

  it('no lanza errores al desmontarse', () => {
    const palabras = [{ text: 'test', count: 1 }]
    const { unmount } = render(<WordCloud words={palabras} />)
    expect(() => unmount()).not.toThrow()
  })
})
