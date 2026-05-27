import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Perfil from './pages/Perfil';
import Login from './pages/Login';
import Logout from './pages/Logout';
import { ConfigProvider } from './context/ConfigContext';
import Configuracoes from './pages/Configuracoes';

function App() {
  return (
    <ConfigProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </ConfigProvider>
  );
}

export default App;