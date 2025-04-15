import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/users'); // ou o endpoint correto
      const data = await res.json();

      const userEncontrado = data.find((user) => user.email === email && user.senha === senha);

      if (userEncontrado) {
        // salvar o login no localStorage (ou outro método de autenticação mais avançado depois)
        localStorage.setItem('usuarioLogado', JSON.stringify(userEncontrado));
        navigate('/mainpage'); // ou o nome da sua mainpage
      } else {
        setErro('Email ou senha inválidos');
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
        <button type="submit">Entrar</button>
        {erro && <p className="erro">{erro}</p>}
      </form>
    </div>
  );
}
