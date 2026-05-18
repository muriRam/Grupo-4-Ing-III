import { Chart, registerables } from 'chart.js';
import { useEffect, useRef } from 'react';
Chart.register(...registerables);

export const DiasSemanaGraph = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvasRef.current) return
        const chart = new Chart(canvasRef.current, {
            type: 'bar',
            data: {
                labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
                datasets: [{
                    label: 'Cantidad de mensajes',
                    data: [142, 168, 195, 183, 210, 97, 74]
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
    }, [])
    return <canvas ref={canvasRef} />
}
