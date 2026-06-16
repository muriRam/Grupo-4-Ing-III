import JSZip from "jszip";
import { useRef, useState } from "react";
import type { ChangeEvent, CSSProperties, DragEvent } from "react";
import { hasValidWhatsappLine } from "./utils/whatsapp";

type FileUploadProps = {
  onContinue: () => void;
};

const stepText = {
  android: [
    "Abrí WhatsApp y tocá el chat que querés exportar",
    "Tocá los tres puntos en la esquina superior derecha > Más",
    "Tocá Exportar chat",
    "Seleccioná Sin archivos multimedia",
  ],
  iphone: [
    "Abrí WhatsApp y el chat que querés exportar > tocá el nombre del chat en la parte superior",
    "Desplazate hasta el final de la información del chat",
    "Tocá Exportar chat",
    "Elegí Sin medios",
    "Tocá Guardar en Archivos > En mi iPhone y guardalo localmente",
  ],
};

function FileUpload({ onContinue }: FileUploadProps) {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setSelectedFileName(files[0].name);
    setSelectedFile(files[0]);
    setErrorMessage(null);
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    handleFiles(event.dataTransfer.files);
  };

  const extractTextFile = async (file: File): Promise<string | null> => {
    const text = await file.text();
    return hasValidWhatsappLine(text) ? text : null;
  };

  const extractZipFile = async (file: File): Promise<string | null> => {
    const zip = await JSZip.loadAsync(file);
    const entries = Object.values(zip.files);
    const textEntry = entries.find(
      (entry) => !entry.dir && entry.name.toLowerCase().endsWith(".txt")
    );
    if (!textEntry) return null;
    const text = await textEntry.async("string");
    return hasValidWhatsappLine(text) ? text : null;
  };

  const extractChatText = async (): Promise<string | null> => {
    if (!selectedFile) return null;
    const extension = selectedFile.name.toLowerCase();
    if (extension.endsWith(".txt")) return extractTextFile(selectedFile);
    if (extension.endsWith(".zip")) return extractZipFile(selectedFile);
    return null;
  };

  const clearSelectedFile = () => {
    setSelectedFileName(null);
    setSelectedFile(null);
    setErrorMessage(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onContinueClick = async () => {
    const chatText = await extractChatText();
    if (!chatText) {
      setErrorMessage(
        "El archivo no parece ser un chat exportado de WhatsApp. Por favor subí un archivo .txt o .zip válido."
      );
      return;
    }
    onContinue(chatText);
  };

  // ── Estilos ──────────────────────────────────────────────────────────────

  const wrapperStyle: CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  };

  const sectionStyle: CSSProperties = {
    width: "100%",
    maxWidth: 760,
  };

  const dropZoneStyle: CSSProperties = {
    cursor: "pointer",
    border: "2px dashed #4f46e5",
    borderRadius: 16,
    padding: "44px 28px",
    background: dragActive ? "#eef2ff" : "#fafbff",
    color: "#111827",
    fontSize: 18,
    lineHeight: 1.5,
    textAlign: "center",
    transition: "background 0.2s, border-color 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 180,
    position: "relative",
  };

  const fileInfoStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  };

  const fileLabelStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 600,
  };

  const clearButtonStyle: CSSProperties = {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "1px solid rgba(0,0,0,0.1)",
    background: "#ffffff",
    color: "#111827",
    cursor: "pointer",
    fontSize: 18,
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const buttonStyle: CSSProperties = {
    marginTop: 24,
    width: "100%",
    padding: "14px 18px",
    borderRadius: 12,
    border: "none",
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 600,
  };

  const instructionsContainerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    marginTop: 28,
    flexWrap: "wrap",
  };

  // tarjeta Android: toque verde muy suave
  const androidCardStyle: CSSProperties = {
    flex: "1 1 320px",
    minWidth: 0,
    padding: "20px 24px",
    borderRadius: 14,
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
  };

  // tarjeta iPhone: toque azul muy suave
  const iphoneCardStyle: CSSProperties = {
    flex: "1 1 320px",
    minWidth: 0,
    padding: "20px 24px",
    borderRadius: 14,
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
  };

  const cardTitleStyle: CSSProperties = {
    margin: 0,
    marginBottom: 16,
    fontSize: 17,
    fontWeight: 700,
    color: "#111827",
    display: "flex",
    alignItems: "center",
    gap: 8,
  };

  const stepListStyle: CSSProperties = {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  };

  return (
    <main style={wrapperStyle}>
      <section style={sectionStyle}>
        {/* Zona de drop */}
        <div style={{ position: "relative" }}>
          <div
            role="button"
            tabIndex={0}
            onClick={openFilePicker}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openFilePicker();
              }
            }}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            style={dropZoneStyle}
          >
            {selectedFileName ? (
              <div style={fileInfoStyle}>
                <div style={fileLabelStyle}>
                  <span style={{ fontSize: 22 }}>✅</span>
                  <span>Archivo cargado</span>
                </div>
                <span style={{ maxWidth: "100%", wordBreak: "break-word", fontSize: 16 }}>
                  {selectedFileName}
                </span>
              </div>
            ) : (
              "Arrastrá o seleccioná tu archivo .zip o .txt de WhatsApp aquí"
            )}
          </div>

          {selectedFileName && (
            <button
              type="button"
              aria-label="Eliminar archivo seleccionado"
              style={clearButtonStyle}
              onClick={clearSelectedFile}
            >
              ×
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".zip,.txt"
          style={{ display: "none" }}
          onChange={onInputChange}
        />

        {selectedFileName && (
          <button type="button" style={buttonStyle} onClick={onContinueClick}>
            Continuar
          </button>
        )}

        {errorMessage && (
          <div style={{ marginTop: 16, color: "#dc2626", fontSize: 14, lineHeight: 1.5 }}>
            {errorMessage}
          </div>
        )}

        {/* Instrucciones en dos columnas */}
        <div style={instructionsContainerStyle}>
          {/* Android */}
          <div style={androidCardStyle}>
            <h3 style={cardTitleStyle}>
              Android
            </h3>
            <ol style={stepListStyle}>
              {stepText.android.map((step, i) => (
                <li key={step} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span
                    style={{
                      flexShrink: 0,
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      backgroundColor: "#16a34a",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 1,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontSize: 14, lineHeight: 1.6, color: "#1f2937", textAlign: "left" }}>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* iPhone */}
          <div style={iphoneCardStyle}>
            <h3 style={cardTitleStyle}>
              iPhone
            </h3>
            <ol style={stepListStyle}>
              {stepText.iphone.map((step, i) => (
                <li key={step} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span
                    style={{
                      flexShrink: 0,
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      backgroundColor: "#2563eb",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 1,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontSize: 14, lineHeight: 1.6, color: "#1f2937", textAlign: "left" }}>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </main>
  );
}

export default FileUpload;