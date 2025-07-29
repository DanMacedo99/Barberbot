import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* You can add more routes here as needed */}
      <Route path="/login" element={<div>Login</div>} />
      <Route path="/perfil" element={<div>Perfil</div>} />
      <Route path="/configuracoes" element={<div>Configurações</div>} />
      <Route path="/logout" element={<div>Logout</div>} />
    </Routes>
  );
}

export default App;