import { Chart, registerables } from 'chart.js';
import { useEffect, useRef } from 'react';
Chart.register(...registerables);

type Props = {
    data: number[]
}

export const DiasSemanaGraph = ({ data }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvasRef.current) return
        const chart = new Chart(canvasRef.current, {
            type: 'bar',
            data: {
                labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
                datasets: [{
                    label: 'Cantidad de mensajes',
                    data,
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Días con mayor cantidad de mensajes'
                    }
                }
            }
        })
        return () => chart.destroy()
    }, [data])
    return <canvas ref={canvasRef} />
}
