import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import './Header.css';

const Header = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-ninja">NINJA</span>
            <span className="logo-store">STORE</span>
          </Link>

          <nav className="nav">
            <Link to="/" className="nav-link">Produtos</Link>
            {user ? (
              <>
                <Link to="/my-orders" className="nav-link">Meus Pedidos</Link>
                {user.isAdmin && (
                  <Link to="/admin" className="nav-link">Admin</Link>
                )}
                <button onClick={handleLogout} className="nav-link btn-logout">
                  Sair
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-link">Login</Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
