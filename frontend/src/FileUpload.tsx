import { useRef, useState } from 'react'
import type { ChangeEvent, CSSProperties, DragEvent } from 'react'

type FileUploadProps = {
  onContinue: () => void
}

function FileUpload({ onContinue }: FileUploadProps) {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const openFilePicker = () => {
    inputRef.current?.click()
  }

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return
    }
    setSelectedFileName(files[0].name)
  }

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files)
  }

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragActive(true)
  }

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragActive(false)
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragActive(false)
    handleFiles(event.dataTransfer.files)
  }

  const dropZoneStyle: CSSProperties = {
    cursor: 'pointer',
    border: '2px dashed #4f46e5',
    borderRadius: 16,
    padding: '44px 28px',
    background: dragActive ? '#eef2ff' : '#fafbff',
    color: '#111827',
    fontSize: 18,
    lineHeight: 1.5,
    textAlign: 'center',
    transition: 'background 0.2s, border-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    position: 'relative',
  }

  const fileInfoStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  }

  const fileLabelStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontWeight: 600,
  }

  const clearButtonStyle: CSSProperties = {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: '1px solid rgba(0,0,0,0.1)',
    background: '#ffffff',
    color: '#111827',
    cursor: 'pointer',
    fontSize: 18,
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const buttonStyle: CSSProperties = {
    marginTop: 24,
    width: '100%',
    padding: '14px 18px',
    borderRadius: 12,
    border: 'none',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 600,
  }

  const instructionsContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    marginTop: 28,
    flexWrap: 'wrap',
  }

  const instructionBoxStyle: CSSProperties = {
    flex: '1 1 320px',
    minWidth: 0,
    padding: 20,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    color: '#111827',
    boxShadow: '0 1px 4px rgba(15, 23, 42, 0.05)',
  }

  const instructionTitleStyle: CSSProperties = {
    margin: 0,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: 700,
  }

  const instructionListStyle: CSSProperties = {
    margin: 0,
    paddingLeft: 20,
    lineHeight: 1.7,
    fontSize: 15,
  }

  const stepText = {
    android: [
      'Abrí WhatsApp y tocá el chat que querés exportar',
      'Tocá los tres puntos en la esquina superior derecha > Más',
      'Tocá Exportar chat',
      'Seleccioná Sin archivos multimedia',
    ],
    iphone: [
      'Abrí WhatsApp y el chat que querés exportar > tocá el nombre del chat en la parte superior',
      'Desplazate hasta el final de la información del chat',
      'Tocá Exportar chat',
      'Elegí Sin medios',
      'Tocá Guardar en Archivos > En mi iPhone y guardalo localmente',
    ],
  }

  const clearSelectedFile = () => {
    setSelectedFileName(null)
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <section style={{ width: '100%', maxWidth: 760 }}>
        <div style={{ position: 'relative' }}>
          <div
            role="button"
            tabIndex={0}
            onClick={openFilePicker}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                openFilePicker()
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
                <span style={{ maxWidth: '100%', wordBreak: 'break-word', fontSize: 16 }}>
                  {selectedFileName}
                </span>
              </div>
            ) : (
              'Arrastrá o seleccioná tu archivo .zip o .txt de WhatsApp aquí'
            )}
          </div>

          {selectedFileName ? (
            <button
              type="button"
              aria-label="Eliminar archivo seleccionado"
              style={clearButtonStyle}
              onClick={clearSelectedFile}
            >
              ×
            </button>
          ) : null}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".zip,.txt"
          style={{ display: 'none' }}
          onChange={onInputChange}
        />

        {selectedFileName ? (
          <button type="button" style={buttonStyle} onClick={onContinue}>
            Continuar
          </button>
        ) : null}

        <div style={instructionsContainerStyle}>
          <div style={instructionBoxStyle}>
            <h3 style={instructionTitleStyle}>Android</h3>
            <ol style={instructionListStyle}>
              {stepText.android.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <div style={instructionBoxStyle}>
            <h3 style={instructionTitleStyle}>iPhone</h3>
            <ol style={instructionListStyle}>
              {stepText.iphone.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </main>
  )
}

export default FileUpload
