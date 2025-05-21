import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AnimatedRoutes from "./AnimatedRoutes";
import PantallaInicio from "./components/PantallaInicio";
import PantallaPrincipal from "./components/PantallaPrincipal";
import PantallaMensajes from './components/PantallaMensajes';
import PantallaEquipos from "./components/PantallaEquipos";
import PantallaEventos from "./components/PantallaEventos";
import PantallaPerfil from "./components/PantallaPerfil";
import ProtectedRoute from "./components/proteccionRutas/ProtectedRoute";
import ReverseProtectedRoute from "./components/proteccionRutas/ReverseProtectedRoute";

function App() {
  return (
    <Router>
      <AnimatedRoutes>
        <Routes>
          <Route path="/" element={<ReverseProtectedRoute><PantallaInicio /></ReverseProtectedRoute>} />
          <Route path="/principal" element={<ProtectedRoute><PantallaPrincipal /></ProtectedRoute>} />
          <Route path="/equipos" element={<ProtectedRoute><PantallaEquipos /></ProtectedRoute>} />
          <Route path="/eventos" element={<ProtectedRoute><PantallaEventos /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><PantallaPerfil /></ProtectedRoute>} />
          <Route path="/mensajes" element={<ProtectedRoute><PantallaMensajes /></ProtectedRoute>} />
        </Routes>
      </AnimatedRoutes>
    </Router>
  );
}

export default App;
