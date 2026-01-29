import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config/firebase';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import MyOrders from './pages/MyOrders';
import Admin from './pages/Admin';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('App: Iniciando listener de autenticação');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        console.log('App: Estado de autenticação mudou:', firebaseUser ? 'logado' : 'deslogado');
        
        if (firebaseUser) {
          // Buscar dados adicionais do usuário no Firestore
          try {
            console.log('App: Buscando dados do usuário no Firestore');
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            const userData = userDoc.exists() ? userDoc.data() : {};
            console.log('App: Dados do usuário obtidos:', userData);
            
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              isAdmin: userData.isAdmin || false
            });
          } catch (firestoreError) {
            console.error('App: Erro ao buscar dados do Firestore:', firestoreError);
            // Continua mesmo se falhar ao buscar dados do Firestore
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              isAdmin: false
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('App: Erro no listener de autenticação:', error);
        setUser(null);
      } finally {
        console.log('App: Finalizando loading');
        setLoading(false);
      }
    });

    // Timeout de segurança: se após 10 segundos ainda estiver carregando, força o fim do loading
    const timeoutId = setTimeout(() => {
      console.warn('App: Timeout de segurança ativado - forçando fim do loading');
      setLoading(false);
    }, 10000);

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <Header user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetail user={user} />} />
        <Route path="/my-orders" element={<MyOrders user={user} />} />
        <Route path="/admin" element={<Admin user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
