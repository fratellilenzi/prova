import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Errore durante login.');
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="email" placeholder="Email" required onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input
        type="password"
        placeholder="Password"
        required
        minLength={8}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">Accedi</button>
      {message && <p className="message error">{message}</p>}
    </form>
  );
}
