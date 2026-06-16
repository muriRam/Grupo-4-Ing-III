import { Chart, registerables } from "chart.js";
import { useEffect, useRef } from "react";
Chart.register(...registerables);

export const EmojiGraph = ({
  data,
}: {
  data: { emoji: string; count: number }[];
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const chart = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: data.map((d) => d.emoji),
        datasets: [
          {
            label: "Cantidad de usos",
            data: data.map((d) => d.count),
          },
        ],
      },
    });
    return () => chart.destroy();
  }, [data]);
  return <canvas ref={canvasRef} />;
};
