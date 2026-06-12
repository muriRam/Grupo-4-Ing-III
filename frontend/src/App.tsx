import { useState } from "react";

import FileUpload from "./FileUpload";

import { EmojiGraph, FranjaHorariaGraph, DiasSemanaGraph, MensajesPorUsuarioGraph, WordCloud } from "./components/graphs";
import { buildChatData, type ChatData } from "./utils/whatsappParser";


function App() {
  const [chatData, setChatData] = useState<ChatData | null>(null);

  const handleContinue = (chatText: string) => {
    setChatData(buildChatData(chatText));
  };

  if (!chatData) {
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

      <article id="word-cloud">
        <h2>Mensajes por usuario</h2>
        <MensajesPorUsuarioGraph />
      </article>

      <article id="franja-horaria">
        <h2>Cantidad de mensajes por franja horaria</h2>
        <FranjaHorariaGraph data={chatData.franjaHoraria} />
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
