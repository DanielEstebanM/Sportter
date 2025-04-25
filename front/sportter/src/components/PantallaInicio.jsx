import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function PantallaInicio() {
  const [isLogin, setIsLogin] = useState(true);

  // Colores y gradientes
  const primaryGradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  const secondaryGradient = "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)";
  const accentColor = "#9f7aea";

  // Animaciones
  const formVariants = {
    hidden: { 
      opacity: 0,
      y: 10,
      scale: 0.98
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      y: -10,
      scale: 0.98,
      transition: { 
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div 
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ 
        background: secondaryGradient,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="card shadow-lg p-4 border-0"
        style={{ 
          width: "100%", 
          maxWidth: "450px", 
          borderRadius: "25px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          overflow: "hidden"
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "register"}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ width: "100%" }}
            layout // Animación automática para cambios de tamaño
            transition={{
              duration: 0.3,
              ease: "easeInOut",
              layout: { 
                duration: 0.4,
                ease: "easeInOut"
              }
            }}
          >
            <motion.div variants={itemVariants} layout>
              <h2 
                className="text-center mb-4 fw-bold"
                style={{
                  background: primaryGradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: "2rem"
                }}
              >
                {isLogin ? "Iniciar Sesión" : "Registrarse"}
              </h2>
            </motion.div>

            <motion.form layout>
              {!isLogin && (
                <motion.div 
                  variants={itemVariants} 
                  className="mb-3"
                  layout
                  transition={{ duration: 0.2 }}
                >
                  <label className="form-label fw-medium" style={{ color: "#4a5568" }}>Nombre</label>
                  <motion.input
                    whileFocus={{ 
                      scale: 1.02,
                      boxShadow: `0 0 0 2px ${accentColor}`
                    }}
                    type="text"
                    className="form-control py-2"
                    placeholder="Tu nombre"
                    style={{ borderRadius: "10px", borderColor: "#e2e8f0" }}
                  />
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="mb-3" layout>
                <label className="form-label fw-medium" style={{ color: "#4a5568" }}>Correo electrónico</label>
                <motion.input
                  whileFocus={{ 
                    scale: 1.02,
                    boxShadow: `0 0 0 2px ${accentColor}`
                  }}
                  type="email"
                  className="form-control py-2"
                  placeholder="tucorreo@email.com"
                  style={{ borderRadius: "10px", borderColor: "#e2e8f0" }}
                />
              </motion.div>

              <motion.div variants={itemVariants} className="mb-3" layout>
                <label className="form-label fw-medium" style={{ color: "#4a5568" }}>Contraseña</label>
                <motion.input
                  whileFocus={{ 
                    scale: 1.02,
                    boxShadow: `0 0 0 2px ${accentColor}`
                  }}
                  type="password"
                  className="form-control py-2"
                  placeholder="********"
                  style={{ borderRadius: "10px", borderColor: "#e2e8f0" }}
                />
              </motion.div>

              <motion.div variants={itemVariants} className="mt-4" layout>
                <motion.button
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: `0 5px 15px rgba(159, 122, 234, 0.4)`
                  }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn w-100 py-2 fw-bold"
                  style={{
                    background: primaryGradient,
                    color: "white",
                    borderRadius: "12px",
                    border: "none",
                    fontSize: "1.1rem"
                  }}
                >
                  {isLogin ? "Entrar" : "Registrarse"}
                </motion.button>
              </motion.div>
            </motion.form>

            <motion.div variants={itemVariants} className="text-center mt-4" layout>
              <small className="text-muted">
                {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-link p-0 fw-bold"
                  onClick={() => setIsLogin(!isLogin)}
                  style={{
                    color: accentColor,
                    textDecoration: "none"
                  }}
                >
                  {isLogin ? "Regístrate" : "Inicia sesión"}
                </motion.button>
              </small>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default PantallaInicio;