import { useState } from "react";

import FileUpload from "./FileUpload";

import { EmojiGraph, FranjaHorariaGraph, DiasSemanaGraph, MensajesPorUsuarioGraph, WordCloud } from "./components/graphs";

interface AnalyzeResult {
  franjaHoraria: number[];
}

const sampleWords = [
  { text: "hola", count: 10 },
  { text: "grupo", count: 7 },
  { text: "mensaje", count: 5 },
  { text: "gracias", count: 9 },
  { text: "jaja", count: 14 },
  { text: "buenas", count: 8 },
  { text: "igual", count: 6 },
  { text: "okay", count: 11 },
  { text: "claro", count: 9 },
  { text: "también", count: 7 },
  { text: "mañana", count: 6 },
  { text: "cuando", count: 5 },
  { text: "bien", count: 13 },
  { text: "dale", count: 12 },
  { text: "favor", count: 4 },
  { text: "noche", count: 6 },
  { text: "tarde", count: 5 },
  { text: "espera", count: 4 },
  { text: "perfecto", count: 8 },
  { text: "Nico", count: 32 },
];

function App() {
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);

  const handleContinue = async (chatText: string) => {
    const response = await fetch("http://localhost:3000/whatsapp/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: chatText }),
    });
    const data: AnalyzeResult = await response.json();
    setAnalyzeResult(data);
  };

  if (!analyzeResult) {
    return <FileUpload onContinue={handleContinue} />;
  }

  return (
    <main className="container">
      <header id="introduccion">
        <h1>Bienvenido a su chat review!</h1>
      </header>

      <article id="word-cloud">
        <h2>Nube de palabras</h2>
        <WordCloud words={sampleWords} />
      </article>

      <article id="word-cloud">
        <h2>Mensajes por usuario</h2>
        <MensajesPorUsuarioGraph />
      </article>

      <article id="franja-horaria">
        <h2>Cantidad de mensajes por franja horaria</h2>
        <FranjaHorariaGraph data={analyzeResult.franjaHoraria} />
      </article>

      <article id="emoji-graph">
        <h2>Emojis mas utilizados</h2>
        <EmojiGraph />
      </article>

      <article id="dias-semana">
        <h2>Cantidad de mensajes por dia de la semana</h2>
        <DiasSemanaGraph />
      </article>
    </main>
  );
}

export default App;
