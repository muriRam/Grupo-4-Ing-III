import { useState } from "react";

import FileUpload from "./FileUpload";

import {
  EmojiGraph,
  FranjaHorariaGraph,
  DiasSemanaGraph,
  MensajesPorUsuarioGraph,
  WordCloud,
} from "./components/graphs";

interface AnalyzeResult {
  franjaHoraria: number[];
  wordCloud: { text: string; count: number }[];
  emojis: { emoji: string; count: number }[];
  diasSemana: number[];
  mensajesPorUsuario: { usuario: string; cantidad: number }[];
}

function App() {
  const [showUpload, setShowUpload] = useState(true);

  const handleContinue = async (chatText: string) => {
    const headers = { "Content-Type": "application/json" };
    const bodyText = JSON.stringify({ text: chatText });
    const bodyChat = JSON.stringify({ chat: chatText });

    const [franjaRes, wordCloudRes, emojisRes, diasSemanaRes, mensajesRes] = await Promise.all([
      fetch("http://localhost:3000/whatsapp/analyze", { method: "POST", headers, body: bodyText }),
      fetch("http://localhost:3000/whatsapp/word-cloud", { method: "POST", headers, body: bodyText }),
      fetch("http://localhost:3000/whatsapp/emojis", { method: "POST", headers, body: bodyText }),
      fetch("http://localhost:3000/whatsapp/dias-semana", { method: "POST", headers, body: bodyText }),
      fetch("http://localhost:3000/mensajes-por-usuario", { method: "POST", headers, body: bodyChat }),
    ]);

    const [franjaData, wordCloudData, emojisData, diasSemanaData, mensajesData] = await Promise.all([
      franjaRes.json(),
      wordCloudRes.json(),
      emojisRes.json(),
      diasSemanaRes.json(),
      mensajesRes.json(),
    ]);

    setAnalyzeResult({
      franjaHoraria: franjaData.franjaHoraria,
      wordCloud: wordCloudData,
      emojis: emojisData.emojis,
      diasSemana: diasSemanaData.diasSemana,
      mensajesPorUsuario: mensajesData.mensajesPorUsuario,
    });
  };

  if (showUpload) {
    return <FileUpload onContinue={() => setShowUpload(false)} />;
  }

  return (
    <main className="container">
      <header id="introduccion">
        <h1>Bienvenido a su chat review!</h1>
      </header>

      <article id="word-cloud">
        <h2>Nube de palabras</h2>
        <WordCloud words={analyzeResult.wordCloud} />
      </article>

      <article id="mensajes-por-usuario">
        <h2>Mensajes por usuario</h2>
        <MensajesPorUsuarioGraph data={analyzeResult.mensajesPorUsuario} />
      </article>
      
      <article id="franja-horaria">
        <h2>Cantidad de mensajes por franja horaria</h2>
        <FranjaHorariaGraph />
      </article>

      <article id="emoji-graph">
        <h2>Emojis mas utilizados</h2>
        <EmojiGraph data={analyzeResult.emojis} />
      </article>

      <article id="dias-semana">
        <h2>Cantidad de mensajes por dia de la semana</h2>
        <DiasSemanaGraph data={analyzeResult.diasSemana} />
      </article>
    </main>
  );
}

export default App;
