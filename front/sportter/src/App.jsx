import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnimatedRoutes from './AnimatedRoutes';
import PantallaInicio from "./components/PantallaInicio";
import PantallaPrincipal from "./components/PantallaPrincipal";
import PantallaMensajes from './components/PantallaMensajes';
import PantallaEquipos from './components/PantallaEquipos';
import PantallaEventos from './components/PantallaEventos';
import PantallaPerfil from './components/PantallaPerfil';

function App() {
  return (
    <Router>
      <AnimatedRoutes>
        <Routes>
          <Route path="/" element={<PantallaInicio />} />
          <Route path="/principal" element={<PantallaPrincipal />} />
          <Route path="/mensajes" element={<PantallaMensajes />} />
          <Route path="/equipos" element={<PantallaEquipos />} />
          <Route path="/eventos" element={<PantallaEventos />} />
          <Route path="/perfil" element={<PantallaPerfil />} />
        </Routes>
      </AnimatedRoutes>
    </Router>
  );
}

export default App;