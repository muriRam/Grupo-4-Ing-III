import { Chart, registerables } from 'chart.js';
import { useEffect, useRef } from 'react';
Chart.register(...registerables);

type Props = {
    data: { usuario: string; cantidad: number }[]
}

export const MensajesPorUsuarioGraph = ({ data }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvasRef.current) return
        const chart = new Chart(canvasRef.current, {
            type: 'bar',
            data: {
                labels: data.map(m => m.usuario),
                datasets: [{
                    label: 'Cantidad de mensajes',
                    data: data.map(m => m.cantidad)
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Cantidad de mensajes por usuario'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })
        return () => chart.destroy()
    }, [data])
    return <canvas ref={canvasRef} />
}
