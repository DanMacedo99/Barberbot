import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { ConfigProvider } from './context/ConfigContext';
import Configuracoes from './pages/Configuracoes';

function App() {
  return (
    <ConfigProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* You can add more routes here as needed */}
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/perfil" element={<div>Perfil</div>} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/logout" element={<div>Logout</div>} />
      </Routes>
    </ConfigProvider>
  );
}

export default App;