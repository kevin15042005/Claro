import React from "react";
import imagenClaro from "../../assets/claro.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  const handleClick = () => {
    window.scrollTo(0, 0); // Corregido de "windos" a "window"
  };

  return (
    <div className="w-full fixed top-0 left-0 bg-red-600 shadow-md z-50 gap-11">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo Claro */}
          <img 
            src={imagenClaro} 
            alt="Claro" 
            className="h-10 object-contain" 
          />
          
          {/* Botón Cerrar Sesión */}
          <Link
            to="/"
            onClick={handleClick}
            className="text-white hover:text-gray-200 px-4 py-2 transition-colors flex items-center"
          >
            Cerrar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}