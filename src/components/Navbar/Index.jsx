import React from "react";
import imagenClaro from "../../assets/claro.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="w-full fixed top-0 left-0 bg-white shadow-sm z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo Claro y título */}
          <div className="flex items-center gap-4">
            <img 
              src={imagenClaro} 
              alt="Claro" 
              className="h-8 object-contain" 
            />
            <h1 className="text-lg font-semibold text-gray-800 hidden md:block">
              Drive (Desplegado)
            </h1>
          </div>
          
          {/* Botón Cerrar Sesión */}
          <Link
            to="/"
            onClick={handleClick}
            className="text-red-600 hover:text-red-800 px-4 py-2 transition-colors flex items-center font-medium"
          >
            Cerrar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}