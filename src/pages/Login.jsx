import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Criar nova conta
        console.log('Criando conta para:', email);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Conta criada com sucesso:', userCredential.user.uid);
        
        // Criar documento do usuário no Firestore
        try {
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            email: email,
            isAdmin: false,
            createdAt: new Date()
          });
          console.log('Documento do usuário criado no Firestore');
        } catch (firestoreError) {
          console.error('Erro ao criar documento no Firestore:', firestoreError);
          // Continua mesmo se falhar ao criar o documento
        }
      } else {
        // Login
        console.log('Fazendo login para:', email);
        await signInWithEmailAndPassword(auth, email, password);
        console.log('Login realizado com sucesso');
      }
      
      // Pequeno delay para garantir que o estado de autenticação foi atualizado
      setTimeout(() => {
        setLoading(false);
        navigate('/');
      }, 500);
      
    } catch (error) {
      console.error('Erro de autenticação:', error);
      setLoading(false);
      
      // Mensagens de erro mais amigáveis
      let errorMessage = 'Erro ao processar sua solicitação';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este e-mail já está em uso';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'E-mail inválido';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Credenciais inválidas';
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">
          {isSignUp ? 'Criar Conta' : 'Login'}
        </h1>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength="6"
              disabled={loading}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Carregando...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
          </button>
        </form>

        <p className="toggle-text">
          {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="toggle-button"
            disabled={loading}
          >
            {isSignUp ? 'Fazer Login' : 'Criar Conta'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
