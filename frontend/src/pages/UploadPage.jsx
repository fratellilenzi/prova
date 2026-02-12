import { useEffect, useState } from 'react';
import { api } from '../api/client';

export function UploadPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ titolo: '', categoria: '', file: null });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('titolo', form.titolo);
    formData.append('categoria', form.categoria);
    formData.append('file', form.file);

    try {
      await api.post('/documents', formData);
      setMessage({ type: 'success', text: 'Documento caricato correttamente.' });
      setForm({ titolo: '', categoria: '', file: null });
      event.target.reset();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Errore upload.' });
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Carica nuovo documento</h2>
      <input
        placeholder="Titolo documento"
        required
        minLength={3}
        value={form.titolo}
        onChange={(e) => setForm({ ...form, titolo: e.target.value })}
      />
      <select required value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
        <option value="">Seleziona categoria</option>
        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <input type="file" accept="application/pdf" required onChange={(e) => setForm({ ...form, file: e.target.files[0] })} />
      <button type="submit">Carica</button>
      {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
    </form>
  );
}
