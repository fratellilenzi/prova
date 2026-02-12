import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { DocumentCard } from '../components/DocumentCard';

export function HomePage() {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [message, setMessage] = useState('');

  async function fetchCategories() {
    const { data } = await api.get('/categories');
    setCategories(data);
  }

  async function fetchDocuments() {
    const params = { q: search || undefined, category: category || undefined, page, pageSize: 8 };
    const { data } = await api.get('/documents', { params });
    setDocuments(data.data);
    setPagination(data.pagination);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchDocuments().catch(() => setMessage('Impossibile recuperare i documenti.'));
  }, [search, category, page]);

  return (
    <main>
      <section className="filters">
        <input
          placeholder="Cerca per nome documento"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setPage(1);
          }}
        >
          <option value="">Tutte le categorie</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </section>

      {message && <p className="message error">{message}</p>}

      <section className="docs-grid">
        {documents.map((document) => (
          <DocumentCard key={document.id} document={document} />
        ))}
        {documents.length === 0 && <p>Nessun documento disponibile.</p>}
      </section>

      <section className="pagination">
        <button disabled={page <= 1} onClick={() => setPage((old) => old - 1)}>
          Precedente
        </button>
        <span>
          Pagina {page} di {pagination.totalPages || 1}
        </span>
        <button disabled={page >= (pagination.totalPages || 1)} onClick={() => setPage((old) => old + 1)}>
          Successiva
        </button>
      </section>
    </main>
  );
}
