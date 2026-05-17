import { Chart, registerables } from 'chart.js';
import { useEffect, useRef } from 'react';
Chart.register(...registerables);

// Conteo de mensajes enviados por cada participante, derivado de un chat
// real exportado de WhatsApp (chat-ejemplo.txt, no versionado por privacidad).
// Se usa como dato mock hasta que el backend provea el procesamiento real.
const mensajesPorUsuario = [
    { usuario: 'Martin', cantidad: 6258 },
    { usuario: 'Muri', cantidad: 3458 },
    { usuario: 'Imanol', cantidad: 3279 },
    { usuario: 'Santi', cantidad: 2438 },
    { usuario: 'Jose', cantidad: 2081 },
    { usuario: 'Enzo', cantidad: 456 },
]

export const MensajesPorUsuarioGraph = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvasRef.current) return
        const chart = new Chart(canvasRef.current, {
            type: 'bar',
            data: {
                labels: mensajesPorUsuario.map(m => m.usuario),
                datasets: [{
                    label: 'Cantidad de mensajes',
                    data: mensajesPorUsuario.map(m => m.cantidad)
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
    }, [])
    return <canvas ref={canvasRef} />
}
