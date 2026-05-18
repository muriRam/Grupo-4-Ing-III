import { Chart, registerables } from 'chart.js';
import { useEffect, useRef } from 'react';
Chart.register(...registerables);

export const FranjaHorariaGraph = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvasRef.current) return
        const chart = new Chart(canvasRef.current, {
            type: 'bar',
            data: {
                labels: [
                    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
                    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
                    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
                    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
                ],
                datasets: [{
                    label: 'Cantidad de mensajes',
                    data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 51))
                }]
            }
        })
        return () => chart.destroy()
    }, [])
    return <canvas ref={canvasRef} />
}