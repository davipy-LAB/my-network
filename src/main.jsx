import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'  // Importando o BrowserRouter
import './index.css'
import App from './App.jsx'
import CreateProfile from './create-profile.jsx'  // Importe a página de criação de perfil
import { MainPage } from './mainpage.jsx';  // Importação nomeada corrigida

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>  {/* Envolva sua aplicação com o BrowserRouter */}
      <Routes>
        <Route path="/" element={<App />} />  {/* Página de registro */}
        <Route path="/create-profile" element={<CreateProfile />} />  {/* Página de criação de perfil */}
        <Route path="/mainpage" element={<MainPage />} />  {/* Página principal */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
