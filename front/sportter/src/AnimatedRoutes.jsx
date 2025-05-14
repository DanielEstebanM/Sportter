import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingScreen from "./LoadingScreen";

const AnimatedRoutes = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [prevLocation, setPrevLocation] = useState(location);

  useEffect(() => {
    if (location.pathname !== prevLocation.pathname) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setPrevLocation(location);
      }, 1500); // Duración de la pantalla de carga
        
      return () => clearTimeout(timer);
    }
  }, [location, prevLocation]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" />
        ) : (
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1]
            }}
            style={{ height: "100%", width: "100%" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnimatedRoutes;