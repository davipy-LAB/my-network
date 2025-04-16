import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando o hook de navegação
import './App.css'; // Importando o CSS

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();  // Hook para navegação

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      email,
      password,
    };

    try {
      const response = await fetch('https://networq-wv7c.onrender.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message);
        navigate('/create-profile'); // Redireciona após registro
      } else {
        const errorMessage = await response.text();
        setMessage(`Erro: ${errorMessage}`);
      }
    } catch (error) {
      setMessage(`Erro ao registrar usuário: ${error.message}`);
    }
  };

  const handleRedirectToLogin = () => {
    navigate('/login'); // Redireciona para a página de login
  };

  return (
    <div className="App">
      <h1>NetworQ</h1>
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
            <button type="button" onClick={handleRedirectToLogin}>
              I already have an account
            </button>
          </div>
        </form>
        {message && <p style={{ marginTop: '10px', color: 'red' }}>{message}</p>}
      </div>
    </div>
  );
}

export default App;
// App.jsx