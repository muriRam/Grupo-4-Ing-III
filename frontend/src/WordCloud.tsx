import { useEffect, useRef } from 'react'

type WordCloudWord = {
  text: string
  count: number
}

type WordCloudProps = {
  words: WordCloudWord[]
}

const palette = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf'
]

function WordCloud({ words }: WordCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 720
    const height = 420
    const dpr = window.devicePixelRatio || 1

    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#111'

    if (!words || words.length === 0) {
      ctx.fillText('No hay datos para mostrar', width / 2, height / 2)
      return
    }

    const counts = words.map((word) => word.count)
    const minCount = Math.min(...counts)
    const maxCount = Math.max(...counts)
    const range = Math.max(maxCount - minCount, 1)
    const centerX = width / 2
    const centerY = height / 2
    const placed: Array<{ x: number; y: number; w: number; h: number }> = []

    const sortedWords = [...words].sort((a, b) => b.count - a.count)

    const collides = (x: number, y: number, w: number, h: number) =>
      placed.some((item) => {
        return !(x + w < item.x || x > item.x + item.w || y + h < item.y || y > item.y + item.h)
      })

    sortedWords.forEach((word, index) => {
      const fontSize = 16 + ((word.count - minCount) / range) * 38
      ctx.font = `${Math.round(fontSize)}px Arial, sans-serif`
      const metrics = ctx.measureText(word.text)
      const textWidth = metrics.width
      const textHeight = fontSize

      let angle = 0
      let radius = 0
      let placedX = centerX
      let placedY = centerY

      while (radius < Math.max(width, height)) {
        placedX = centerX + Math.cos(angle) * radius
        placedY = centerY + Math.sin(angle) * radius

        const x = placedX
        const y = placedY
        const rectX = x - textWidth / 2
        const rectY = y - textHeight / 2

        if (
          rectX >= 0 &&
          rectY >= 0 &&
          rectX + textWidth <= width &&
          rectY + textHeight <= height &&
          !collides(rectX, rectY, textWidth, textHeight)
        ) {
          placed.push({ x: rectX, y: rectY, w: textWidth, h: textHeight })
          ctx.fillStyle = palette[index % palette.length]
          ctx.fillText(word.text, x, y)
          break
        }

        angle += 0.36
        radius += 1.9
      }
    })
  }, [words])

  return (
    <div style={{ maxWidth: '740px', margin: '0 auto', padding: '1rem' }}>
      <canvas
        ref={canvasRef}
        width={720}
        height={420}
        style={{ width: '100%', height: 'auto', borderRadius: '16px', background: '#fafafa', display: 'block' }}
      />
    </div>
  )
}

export default WordCloud
