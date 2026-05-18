import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
// @ts-ignore: importing a manual JSX component without a declaration file
import WordCloud from "./WordCloud.jsx";
import FileUpload from "./FileUpload";

import "./App.css";
import { EmojiGraph, FranjaHorariaGraph, DiasSemanaGraph, MensajesPorUsuarioGraph } from "./components/graphs";

function App() {
  const [showUpload, setShowUpload] = useState(true);
  const [count, setCount] = useState(0);

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
    <>
      <section id="word-cloud">
        <h2>Nube de palabras</h2>
        <WordCloud words={sampleWords} />
      </section>

      <MensajesPorUsuarioGraph />
      <FranjaHorariaGraph />
      <EmojiGraph />
      <DiasSemanaGraph />
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  );
}

export default App;
