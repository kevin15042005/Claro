import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function App() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentForm, setCurrentForm] = useState(() => {
    return localStorage.getItem("currentForm") || "login";
  });

  const changeForm = (formName) => {
    setCurrentForm(formName);
    localStorage.setItem("currentForm", formName);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const correo = e.target.correo.value;
    const contraseña = e.target.contraseña.value;

    try {
      const res = await fetch("/administrador/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contraseña }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Credenciales incorrectas");
      }

      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      localStorage.setItem("ingreso", true);
      navigate("/Datos");
      
    } catch (err) {
      console.error("Error al iniciar sesión", err);
      setError(err.message || "Error al iniciar sesión");
      localStorage.setItem("ingreso", false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main >
      <div className="w-[500px] h-xl max-w-md px-6 py-8">
        {currentForm === "login" && (
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-red-700 py-4 px-6">
              <h2 className="text-2xl font-bold text-white text-center">
                Inicio de Sesión
              </h2>
            </div>
            
            <form className="p-6 space-y-6" onSubmit={handleLogin}>
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p>{error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="correo"
                  placeholder="tu@email.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              {/* Campo de contraseña */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="contraseña"
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon 
                      icon={showPassword ? faEye : faEyeSlash } 
                      className="h-5 w-5"
                    />
                  </button>
                </div>
              </div>
              
              {/* Botón de submit */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    "Ingresar"
                  )}
                </button>
                <div className="buttom-login">
              </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}