import { useState } from "react";

import FileUpload from "./FileUpload";

import {
  EmojiGraph,
  FranjaHorariaGraph,
  DiasSemanaGraph,
  MensajesPorUsuarioGraph,
  WordCloud,
} from "./components/graphs";

import { buildChatData, type ChatData } from "./utils/whatsappParser";

interface AnalyzeResult {
  franjaHoraria: number[];
  emojisMasUsados: { emoji: string; count: number }[];
}

function App() {
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(
    null,
  );
  const [chatData, setChatData] = useState<ChatData | null>(null);

  const handleContinue = async (chatText: string) => {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: chatText }),
    };

    const [resAnalyze, resEmojis] = await Promise.all([
      fetch("http://localhost:3000/whatsapp/analyze", options),
      fetch("http://localhost:3000/whatsapp/emojis", options),
    ]);

    const analyzeJson = await resAnalyze.json();
    const emojisJson = await resEmojis.json();

    setChatData(buildChatData(chatText));
    setAnalyzeResult({
      franjaHoraria: analyzeJson.franjaHoraria,
      emojisMasUsados: emojisJson.emojisMasUsados,
    });
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
        <WordCloud words={chatData.wordCloud} />
      </article>

      <article id="mensajes-por-usuario">
        <h2>Mensajes por usuario</h2>
        <MensajesPorUsuarioGraph data={chatData.mensajesPorUsuario} />
      </article>

      <article id="franja-horaria">
        <h2>Cantidad de mensajes por franja horaria</h2>
        <FranjaHorariaGraph data={analyzeResult.franjaHoraria} />
      </article>

      <article id="emoji-graph">
        <h2>Emojis mas utilizados</h2>
        <EmojiGraph data={analyzeResult.emojisMasUsados} />
      </article>

      <article id="dias-semana">
        <h2>Cantidad de mensajes por dia de la semana</h2>
        <DiasSemanaGraph data={chatData.diasSemana} />
      </article>
    </main>
  );
}

export default App;
