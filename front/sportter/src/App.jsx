import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AnimatedRoutes from "./AnimatedRoutes";
import PantallaInicio from "./components/PantallaInicio";
import PantallaPrincipal from "./components/PantallaPrincipal";
import PantallaMensajes from "./components/PantallaMensajes";
import ProtectedRoute from "./components/proteccionRutas/ProtectedRoute";
import ReverseProtectedRoute from './components/proteccionRutas/ReverseProtectedRoute';


function App() {
  return (
    <Router>
      <AnimatedRoutes>
        <Routes>
          {/* Ruta pública */}
          <Route path="/" element={<ReverseProtectedRoute><PantallaInicio /></ReverseProtectedRoute>} />

          {/* Rutas protegidas */}
            <Route path="/principal" element={<ProtectedRoute><PantallaPrincipal /></ProtectedRoute>} />
            <Route path="/mensajes" element={<ProtectedRoute><PantallaMensajes /></ProtectedRoute>} />
        </Routes>
      </AnimatedRoutes>
    </Router>
  );
}

export default App;
