export function DocumentCard({ document }) {
  const uploadDate = new Date(document.dataUpload).toLocaleDateString('it-IT');

  return (
    <article className="doc-card">
      <div>
        <h3>{document.titolo}</h3>
        <p>
          <strong>Categoria:</strong> {document.categoria}
        </p>
        <p>
          <strong>Data upload:</strong> {uploadDate}
        </p>
        <p>
          <strong>Autore:</strong> {document.uploader?.nome || 'N/D'}
        </p>
      </div>
      <div className="doc-actions">
        <a href={document.urlFile} target="_blank" rel="noreferrer">
          Visualizza
        </a>
        <a href={document.urlFile} download>
          Scarica
        </a>
      </div>
    </article>
  );
}
