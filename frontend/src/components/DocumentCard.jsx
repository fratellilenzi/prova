export function DocumentCard({ document }) {
  const uploadDate = document.dataUpload ? new Date(document.dataUpload).toLocaleDateString('it-IT') : 'N/D';

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
          <strong>Autore:</strong> {document.autoreNome || 'N/D'}
        </p>
      </div>
      <div className="doc-actions">
        <a href={document.urlFile} target="_blank" rel="noreferrer">
          Visualizza
        </a>
        <a href={document.urlFile} target="_blank" rel="noreferrer">
          Scarica
        </a>
      </div>
    </article>
  );
}
