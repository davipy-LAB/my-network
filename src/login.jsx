import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Ajuste para a URL correta (porta 3001)
      const res = await fetch('https://networq-wv7c.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: senha }), // Envia os dados no corpo
      });

      if (!res.ok) {
        throw new Error('Falha na requisição');
      }

      const data = await res.json();

      if (data.error) {
        setErro(data.error); // Exibe a mensagem de erro caso o login falhe
      } else {
        // Salva o email e senha no localStorage antes de ir para MainPage
        localStorage.setItem('emailTemp', email);
        localStorage.setItem('senhaTemp', senha);
        navigate('/mainpage'); // Vai para a tela principal (mainpage.jsx)
      }
    } catch (err) {
      setErro('Erro ao tentar logar. Tente novamente.');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="inputs">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <div className="botao">
          <button type="submit">Entrar</button>
        </div>
        {erro && <p className="erro">{erro}</p>}
      </form>
    </div>
  );
}
