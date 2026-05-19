import { useState } from "react";

import FileUpload from "./FileUpload";

<<<<<<< HEAD
import { EmojiGraph, FranjaHorariaGraph, DiasSemanaGraph, MensajesPorUsuarioGraph, WordCloud } from "./components/graphs";
=======
import { EmojiGraph, FranjaHorariaGraph, DiasSemanaGraph, WordCloud } from "./components/graphs";
>>>>>>> 140e4e39ca9cc2fe8bea061154f2ad0533903ddd

function App() {
  const [showUpload, setShowUpload] = useState(true);

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
        <WordCloud words={sampleWords} />
      </article>

      <article id="word-cloud">
        <h2>Mensajes por usuario</h2>
        <MensajesPorUsuarioGraph />
      </article>
      
      <article id="franja-horaria">
        <h2>Cantidad de mensajes por franja horaria</h2>
        <FranjaHorariaGraph />
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
