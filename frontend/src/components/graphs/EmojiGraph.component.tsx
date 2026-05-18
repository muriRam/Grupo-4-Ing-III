import { Chart, registerables } from "chart.js";
import { useEffect, useRef } from "react";
Chart.register(...registerables);

export const EmojiGraph = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const chart = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: ["😂", "🤣", "😍", "😊", "👍", "👏", "🔥", "😎", "😭", "🎉"],
        datasets: [
          {
            label: "Cantidad de usos",
            data: [120, 95, 88, 76, 70, 63, 58, 54, 49, 45],
          },
        ],
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={canvasRef} />;
};
