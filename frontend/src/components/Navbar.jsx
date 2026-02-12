import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="navbar">
      <div>
        <h1>Associazione Giotto 2015</h1>
        <p className="subtitle">Archivio documentale per medici toscani</p>
      </div>
      <nav>
        <Link to="/">Home</Link>
        {isAuthenticated && <Link to="/upload">Carica documento</Link>}
        {!isAuthenticated ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Registrazione</Link>
          </>
        ) : (
          <button className="link-button" onClick={logout}>
            Logout ({user?.nome})
          </button>
        )}
      </nav>
    </header>
  );
}
