import { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Nova mensagem para feedback visual

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message);  // Atualiza o estado com a mensagem de sucesso
      } else {
        const errorMessage = await response.text();
        setMessage(`Erro: ${errorMessage}`);  // Atualiza o estado com a mensagem de erro
      }
    } catch (error) {
      setMessage(`Erro ao registrar usuário: ${error.message}`);  // Caso ocorra algum erro no fetch
    }
  };

  return (
    <div className="App">
      <h1>My Network</h1>
      <p>The local that you can trust</p>
      <div className="container-create">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="container-input">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="container-input">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="container-buttons">
            <button type="submit">Create</button>
            <button type="button">I already have an account</button>
          </div>
        </form>
        {message && <p style={{ marginTop: '10px', color: 'red' }}>{message}</p>}
      </div>
    </div>
  );
}

export default App;
// O código acima é um exemplo de um aplicativo React que permite aos usuários criar uma conta.
// Ele possui um formulário que coleta o email e a senha do usuário e envia esses dados para um servidor local usando a API Fetch.
// O servidor, que deve estar rodando na porta 3001, recebe os dados e os armazena em um arquivo JSON.
// O aplicativo também exibe mensagens de sucesso ou erro com base na resposta do servidor.