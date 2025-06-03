import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar/Index"
import CrearPopup from "../../components/Create/Index";
import ConfirmarCreacion from "../../components/ConfirmCreate/Index";
import ActualizarPopup from "../../components/Update/Index";
import ConfirmarActualizacion from "../../components/ConfirmUpdate/Index";
import EliminarPopup from "../../components/Delete/Index";
import iconAdd from "../../assets/icons/add.svg";
import iconLogin from "../../assets/icons/login.svg";
import iconUpdate from "../../assets/icons/update.svg";
import iconDelete from "../../assets/icons/delete.svg";
export default function Datos() {
  // Estados para el formulario
  const [nodo, setNodo] = useState("");
  const [technology, setTechnology] = useState("");
  const [tipo, setTipo] = useState("");
  const [information, setInformation] = useState([]);
  const [status, setStatus] = useState({});

  // Estados para las operaciones CRUD
  const [idOperacion, setIdOperacion] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showUpdateConfirmPopup, setShowUpdateConfirmPopup] = useState(false);
  const [searchInformation, setSearchInformation] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const navigate = useNavigate();

  // Limpiar datos del formulario
  const limpiarDatos = () => {
    setNodo("");
    setTechnology("");
    setTipo("");
    setIdOperacion("");
    setSelectedItem(null);
  };

  // Validar campos del formulario
  const validarCampos = () => {
    if (!nodo || !technology || !tipo) {
      toast.warn("Todos los campos son requeridos");
      return false;
    }
    return true;
  };

  // Obtener información del servidor
  const obtenerInformacion = async () => {
    try {
      const res = await fetch("http://100.123.27.39:4000/nodes");
      const data = await res.json();
      setInformation(data);

      const statusData = {};
      data.forEach((item) => {
        statusData[item.id] = Math.random() > 0.3;
      });
      setStatus(statusData);
    } catch (err) {
      console.error("Error al obtener datos", err);
      alert("Error al cargar la información");
    }
  };

  useEffect(() => {
    obtenerInformacion();

    const interval = setInterval(() => {
      obtenerInformacion();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Manejar la creación de datos
  const handleSubmit = async () => {
    if (!validarCampos()) return;

    try {
      const res = await fetch("http://100.123.27.39:4000/nodes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nodo,
          technology,
          tipo,
          tiempo: new Date().getTime() / 1000,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Registro creado exitosamente");
        limpiarDatos();
        setShowConfirmPopup(false);
        setShowCreatePopup(false);
        await obtenerInformacion();
      } else {
        toast.error("Error: " + (data.message || "Error al crear registro"));
      }
    } catch (err) {
      console.error("Error al crear información", err);
      toast.error("Error en la conexión con el servidor");
    }
  };

  // Manejar la actualización de datos
  const handleUpdate = async () => {
    setShowUpdateConfirmPopup(false);

    if (!idOperacion || !validarCampos()) {
      toast.error("ID inválido o campos incompletos");
      return;
    }

    try {
      const res = await fetch(
        `http://100.123.27.39:4000/nodes/${idOperacion}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nodo,
            technology,
            tipo,
            tiempo: new Date().getTime() / 1000,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Registro actualizado correctamente");
        limpiarDatos();
        setShowUpdatePopup(false);
        await obtenerInformacion();
      } else {
        toast.error("Error: " + (data.message || "Error al actualizar"));
      }
    } catch (err) {
      console.error("Error al actualizar", err);
      toast.error("Error en la conexión con el servidor");
    }
  };

  // Manejar la eliminación de datos
  const handleDelete = async () => {
    if (!idOperacion) {
      toast.warn("Ingrese un ID válido");
      return;
    }

    try {
      const res = await fetch(
        `http://100.123.27.39:4000/nodes/${idOperacion}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Registro eliminado correctamente");
        setIdOperacion("");
        setShowDeletePopup(false);
        await obtenerInformacion();
      } else {
        toast.error(data.error || "Error al eliminar registro");
      }
    } catch (err) {
      console.error("Error al eliminar", err);
      toast.error("Error en la conexión con el servidor");
    }
  };

  // Preparar formulario para edición
  const prepararEdicion = (item) => {
    setSelectedItem(item);
    setNodo(item.nodo);
    setTechnology(item.technology);
    setTipo(item.tipo);
    setIdOperacion(item.id);
    setShowUpdatePopup(true);
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Filtrar información
  const filteredInformation = information.filter((item) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchInformation.toLowerCase())
    )
  );

  return (
    <>
      {/* Popups */}
      {showCreatePopup && (
        <CrearPopup
          nodo={nodo}
          setNodo={setNodo}
          technology={technology}
          setTechnology={setTechnology}
          tipo={tipo}
          setTipo={setTipo}
          setShowConfirmPopup={setShowConfirmPopup}
          setShowCreatePopup={setShowCreatePopup}
        />
      )}

      {showConfirmPopup && (
        <ConfirmarCreacion
          nodo={nodo}
          technology={technology}
          tipo={tipo}
          handleSubmit={handleSubmit}
          setShowConfirmPopup={setShowConfirmPopup}
        />
      )}

      {showUpdatePopup && (
        <ActualizarPopup
          idOperacion={idOperacion}
          nodo={nodo}
          setNodo={setNodo}
          technology={technology}
          setTechnology={setTechnology}
          tipo={tipo}
          setTipo={setTipo}
          selectedItem={selectedItem}
          setShowUpdateConfirmPopup={setShowUpdateConfirmPopup}
          setShowUpdatePopup={setShowUpdatePopup}
        />
      )}

      {showUpdateConfirmPopup && (
        <ConfirmarActualizacion
          idOperacion={idOperacion}
          nodo={nodo}
          technology={technology}
          tipo={tipo}
          handleUpdate={handleUpdate}
          setShowUpdateConfirmPopup={setShowUpdateConfirmPopup}
        />
      )}

      {showDeletePopup && (
        <EliminarPopup
          idOperacion={idOperacion}
          information={information}
          handleDelete={handleDelete}
          setShowDeletePopup={setShowDeletePopup}
        />
      )}
  <div>
        <Navbar/>
  </div>
      {/* Contenedor principal */}
      <div className="bg-white p-4 md:p-6 rounded-md w-max m-14">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-4 md:mb-6">
          Hive (Desplegado)
        </h1>

        {/* Controles superiores */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4 md:mb-6">
          <input
            type="text"
            placeholder="Buscar Item"
            value={searchInformation}
            className="p-2 rounded-md border border-gray-300 w-full md:w-auto"
            onChange={(e) => setSearchInformation(e.target.value)}
          />

          <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
            <button
              className="p-2 rounded-md border border-gray-300 hover:bg-green-500 transition-colors flex items-center justify-center w-full md:w-auto"
              onClick={() => setShowCreatePopup(true)}
            >
              <img src={iconAdd} alt="Add" className="h-5 w-5 md:h-6 md:w-6" />
              <span className="ml-2 md:hidden">Crear</span>
            </button>
            <button
              className="p-2 rounded-md border border-gray-300 hover:bg-red-500 transition-colors flex items-center justify-center w-full md:w-auto"
              onClick={logout}
            >
              <img
                src={iconLogin}
                alt="Login"
                className="h-5 w-5 md:h-6 md:w-6"
              />
              <span className="ml-2 md:hidden">Salir</span>
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-gray-200 p-2 md:p-4 rounded-lg overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            {/* Versión para móviles (tarjetas) */}
            <div className="md:hidden space-y-3">
              {filteredInformation.map((item) => {
                const ahora = new Date().getTime() / 1000;
                const tiempoItem = item.tiempo;
                const diferenciaMinutos = (ahora - tiempoItem) / 60;
                const sinNovedad = diferenciaMinutos > 5;

                return (
                  <div key={item.id} className="bg-white p-3 rounded-md shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{item.nodo}</p>
                        <p className="text-sm text-gray-600">ID: {item.id}</p>
                      </div>
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${
                          sinNovedad ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      ></span>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Tiempo</p>
                        <p>
                          {item.tiempo
                            ? new Date(item.tiempo * 1000).toLocaleTimeString(
                                "es-CO"
                              )
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tipo</p>
                        <p>{item.tipo}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tecnología</p>
                        <p>{item.technology}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Aviso</p>
                        <p>{sinNovedad ? "Sin novedad" : "En limbo"}</p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        className="p-1 bg-gray-100 hover:bg-yellow-500 rounded"
                        onClick={() => prepararEdicion(item)}
                      >
                        <img
                          className="h-4 w-4"
                          src={iconUpdate}
                          alt="Editar"
                        />
                      </button>
                      <button
                        className="p-1 bg-gray-100 hover:bg-red-500 rounded"
                        onClick={() => {
                          setIdOperacion(item.id);
                          setShowDeletePopup(true);
                        }}
                      >
                        <img
                          className="h-4 w-4"
                          src={iconDelete}
                          alt="Eliminar"
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Versión para desktop (tabla) */}
            <table className="hidden md:table w-full">
              <thead className="sticky top-0 bg-gray-300">
                <tr>
                  <th className="px-3 py-2 text-left font-bold">ID</th>
                  <th className="px-3 py-2 text-left font-bold">NODO</th>
                  <th className="px-3 py-2 text-left font-bold">TIEMPO</th>
                  <th className="px-3 py-2 text-left font-bold">AVISO</th>
                  <th className="px-3 py-2 text-left font-bold">TIPO</th>
                  <th className="px-3 py-2 text-left font-bold">TECNOLOGÍA</th>
                  <th className="px-3 py-2 text-left font-bold">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {filteredInformation.map((item) => {
                  const ahora = new Date().getTime() / 1000;
                  const tiempoItem = item.tiempo;
                  const diferenciaMinutos = (ahora - tiempoItem) / 60;
                  const esNuevo = diferenciaMinutos <= 1;
                  const sinNovedad = diferenciaMinutos > 5;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-100 border-b border-gray-200"
                    >
                      <td className="px-3 py-2">{item.id}</td>
                      <td className="px-3 py-2">{item.nodo}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {item.tiempo
                          ? new Date(item.tiempo * 1000).toLocaleString(
                              "es-CO",
                              {
                                year: "2-digit",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "N/A"}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block w-3 h-3 rounded-full ${
                              sinNovedad ? "bg-green-500" : "bg-yellow-500"
                            }`}
                          ></span>
                          {sinNovedad ? "Sin novedad" : "En limbo"}
                        </div>
                      </td>
                      <td className="px-3 py-2">{item.tipo}</td>
                      <td className="px-3 py-2">{item.technology}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <button
                            className="p-1 bg-white hover:bg-yellow-500 rounded transition-colors"
                            onClick={() => prepararEdicion(item)}
                          >
                            <img
                              className="h-4 w-4"
                              src={iconUpdate}
                              alt="Editar"
                            />
                          </button>
                          <button
                            className="p-1 bg-white hover:bg-red-500 rounded transition-colors"
                            onClick={() => {
                              setIdOperacion(item.id);
                              setShowDeletePopup(true);
                            }}
                          >
                            <img
                              className="h-4 w-4"
                              src={iconDelete}
                              alt="Eliminar"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
