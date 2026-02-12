import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    try {
      await register(form.nome, form.email, form.password);
      navigate('/');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Errore durante registrazione.');
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Registrazione</h2>
      <input placeholder="Nome e Cognome" required onChange={(e) => setForm({ ...form, nome: e.target.value })} />
      <input type="email" placeholder="Email" required onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input
        type="password"
        placeholder="Password (minimo 8 caratteri)"
        required
        minLength={8}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">Crea account</button>
      {message && <p className="message error">{message}</p>}
    </form>
  );
}
