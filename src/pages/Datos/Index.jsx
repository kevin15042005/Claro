import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar/Index";
import iconAdd from "../../assets/icons/add.svg";
import iconLogin from "../../assets/icons/login.svg";
import iconDelete from "../../assets/icons/delete.svg";
import iconSave from "../../assets/icons/save.svg";
import iconExit from "../../assets/icons/exit.svg";
import iconCancelar from "../../assets/icons/cancelar.svg";
import iconUpdate from "../../assets/icons/update.svg";

export default function Datos() {
  // Estados para el formulario
  const [nodo, setNodo] = useState("");
  const [technology, setTechnology] = useState("");
  const [tipo, setTipo] = useState("");
  const [information, setInformation] = useState([]);
  const [status, setStatus] = useState({}); // Estado para guardar el estado de cada nodo

  // Estados para las operaciones CRUD
  const [idOperacion, setIdOperacion] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showUpdateConfirmPopup, setShowUpdateConfirmPopup] = useState(false);
  const [searchInformation, setSearchInformation] = useState("");

  // Estado para el item seleccionado para edición
  const [selectedItem, setSelectedItem] = useState(null);

  // Estado de horario actual
  const [horaActual, setHoraActual] = useState(() => {
    const ahora = new Date();
    const hora = String(ahora.getHours()).padStart(2, "0");
    const minutos = String(ahora.getMinutes()).padStart(2, "0");
    return `${hora}:${minutos}`;
  });

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

      // Verificar estado de cada nodo
      const statusData = {};
      data.forEach((item) => {
        // Simulamos el estado (en producción harías una llamada API para verificar)
        statusData[item.id] = Math.random() > 0.3; // 70% de probabilidad de estar arriba
      });
      setStatus(statusData);
    } catch (err) {
      console.error("Error al obtener datos", err);
      alert("Error al cargar la información");
    }
  };

  useEffect(() => {
    obtenerInformacion();

    // Verificar estado cada 30 segundos
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
            tiempo: new Date().getTime() / 1000, // Añade esta línea
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
    
      {/* Popup de Creación */}
      {showCreatePopup && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 "
          style={{ background: "rgba(255,255,255,0.8) " }}
        >
          {" "}
          <div className="bg-red-700 p-4 rounded-md w-full max-w-md mx-4 my-8">
            <section className="bg-white p-3 rounded-md mb-3">
              <h3 className="font-serif text-xl text-center">
                Formulario a crear {new Date().toLocaleDateString()}
              </h3>
            </section>

            <form className="bg-white p-3 rounded-md">
              <div className="mb-4">
                <label className="block font-bold text-center mb-1">Nodo</label>
                <input
                  type="text"
                  value={nodo}
                  onChange={(e) => setNodo(e.target.value)}
                  placeholder="Nodo"
                  className="w-full p-2 border border-gray-300 rounded text-center"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block font-bold text-center mb-1">
                  Tecnología
                </label>
                <select
                  value={technology}
                  onChange={(e) => setTechnology(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option className="text-center" value="">
                    Seleccione Tecnología
                  </option>
                  <option className="text-center" value="Poller">
                    Poller
                  </option>
                  <option className="text-center" value="Harmonic">
                    Harmonic
                  </option>
                  <option className="text-center" value="Cisco">
                    Cisco
                  </option>
                  <option className="text-center" value="Aura">
                    Aura
                  </option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block font-bold text-center mb-1">Tipo</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option className="text-center" value="Seleccion">
                    Seleccion Tipo
                  </option>
                  <option className="text-center" value="Optico">
                    Óptico
                  </option>
                  <option className="text-center" value="Virtual">
                    Virtual
                  </option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block font-bold text-center mb-1">Hora</label>
                <input
                  type="text"
                  value={new Date().toLocaleTimeString("es-CO")}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded text-center bg-gray-100"
                />
              </div>
            </form>
            <div className="flex justify-end gap-3 mt-3">
              <button
                className="bg-white hover:bg-green-500 rounded p-2"
                onClick={() => setShowConfirmPopup(true)}
              >
                <img className="h-6 w-6" src={iconSave} alt="Save" />
              </button>
              <button
                className="bg-white hover:bg-red-500 rounded p-2"
                onClick={() => setShowCreatePopup(false)}
              >
                <img className="h-6 w-6" src={iconExit} alt="Exit" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup de Confirmación de Creación */}
      {showConfirmPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 "
          style={{ background: "rgba(255,255,255,0.8) " }}
        >
          {" "}
          <div className="bg-red-600 p-4 rounded-md w-full max-w-md mx-4">
            <h3 className="font-serif text-xl bg-white rounded-md p-3 text-center">
              Confirmar Información
            </h3>
            <ul className="my-3 bg-white p-3 rounded-md">
              <li className="mb-2">
                <strong>Nodo:</strong> {nodo}
              </li>
              <li className="mb-2">
                <strong>Tecnología:</strong> {technology}
              </li>
              <li>
                <strong>Tipo:</strong> {tipo}
              </li>
              <li>
                <strong>Hora creación:</strong>{" "}
                {new Date().toLocaleTimeString("es-CO")}
              </li>
            </ul>
            <div className="flex justify-end gap-3 mt-3">
              <button
                className="bg-white hover:bg-green-500 rounded p-2"
                onClick={handleSubmit}
              >
                <img className="h-6 w-6" src={iconSave} alt="Save" />
              </button>
              <button
                className="bg-white hover:bg-red-500 rounded p-2"
                onClick={() => setShowConfirmPopup(false)}
              >
                <img className="h-6 w-6" src={iconCancelar} alt="Cancelar" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup de Actualización */}
      {showUpdatePopup && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 "
          style={{ background: "rgba(255,255,255,0.8) " }}
        >
          {" "}
          <div className="bg-red-700 p-4 rounded-md w-full max-w-md mx-4 my-8">
            <section className="my-2 bg-white rounded-md p-3">
              <h3 className="font-bold text-lg text-center">
                Actualizar Registro
              </h3>
            </section>

            <form className="bg-white p-3 rounded-md">
              <div className="mb-4">
                <label className="block font-bold mb-1">ID</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded"
                  type="text"
                  value={idOperacion}
                  readOnly
                />
              </div>

              <div className="mb-4">
                <label className="block font-bold mb-1">Nodo</label>
                <input
                  type="text"
                  value={nodo}
                  onChange={(e) => setNodo(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Nodo"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block font-bold mb-1">Tecnología</label>
                <select
                  value={technology}
                  onChange={(e) => setTechnology(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Seleccione Tecnología</option>
                  <option value="Poller">Poller</option>
                  <option value="Harmonic">Harmonic</option>
                  <option value="Cisco">Cisco</option>
                  <option value="Aura">Aura</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block font-bold mb-1">Tipo</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="Seleccione">Seleccion Tipo</option>
                  <option value="Optico">Óptico</option>
                  <option value="Virtual">Virtual</option>
                </select>

                <div className="mb-4">
                  <label className="block font-bold mb-1">
                    Última actualización
                  </label>
                  <input
                    type="text"
                    value={
                      selectedItem?.tiempo
                        ? new Date(selectedItem.tiempo * 1000).toLocaleString(
                            "es-CO"
                          )
                        : "N/A"
                    }
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                  />
                </div>
              </div>
            </form>

            <div className="flex justify-end gap-3 mt-3">
              <button
                className="bg-white hover:bg-green-500 rounded p-2"
                onClick={() => setShowUpdateConfirmPopup(true)}
              >
                <img className="h-6 w-6" src={iconSave} alt="Save" />
              </button>
              <button
                className="bg-white hover:bg-red-500 rounded p-2"
                onClick={() => setShowUpdatePopup(false)}
              >
                <img className="h-6 w-6" src={iconExit} alt="Exit" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup de Confirmación de Actualización */}
      {showUpdateConfirmPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 "
          style={{ background: "rgba(255,255,255,0.8) " }}
        >
          <div className="bg-red-600 p-4 rounded-md w-full max-w-md mx-4">
            <h3 className="font-serif text-xl bg-white rounded-md p-3 text-center">
              Confirmar Actualización
            </h3>
            <div className="my-3 bg-white p-3 rounded-md">
              <p className="mb-3 font-bold">
                ¿Estás seguro que deseas actualizar este registro?
              </p>
              <ul>
                <li className="mb-2">
                  <strong>ID:</strong> {idOperacion}
                </li>
                <li className="mb-2">
                  <strong>Nodo:</strong> {nodo}
                </li>
                <li className="mb-2">
                  <strong>Tecnología:</strong> {technology}
                </li>
                <li className="mb-2">
                  <strong>Tipo:</strong> {tipo}
                </li>
                <li>
                  <strong>Hora actualización:</strong>{" "}
                  {new Date().toLocaleTimeString("es-CO")}
                </li>
              </ul>
            </div>
            <div className="flex justify-end gap-3 mt-3">
              <button
                className="bg-white hover:bg-green-500 rounded p-2"
                onClick={handleUpdate}
              >
                <img className="h-6 w-6" src={iconSave} alt="Confirmar" />
              </button>
              <button
                className="bg-white hover:bg-red-500 rounded p-2"
                onClick={() => setShowUpdateConfirmPopup(false)}
              >
                <img className="h-6 w-6" src={iconCancelar} alt="Cancelar" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup de Eliminación */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-red-700 p-4 rounded-md w-full max-w-md mx-4">
            <div className="bg-white rounded-md p-3 text-center">
              <h3 className="font-bold text-lg">Confirmar Eliminación</h3>
            </div>
            <div className="my-3 bg-white p-3 rounded-md">
              <p className="mb-3 font-bold">
                ¿Estás seguro que deseas eliminar este registro?
              </p>
              {information.find((item) => item.id === idOperacion) && (
                <div>
                  <p>
                    <strong>ID:</strong> {idOperacion}
                  </p>
                  <p>
                    <strong>Nodo:</strong>{" "}
                    {information.find((item) => item.id === idOperacion).nodo}
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-3">
              <button
                className="bg-white hover:bg-green-500 rounded p-2"
                onClick={handleDelete}
              >
                <img className="h-6 w-6" src={iconSave} alt="Confirmar" />
              </button>
              <button
                className="bg-white hover:bg-red-500 rounded p-2"
                onClick={() => setShowDeletePopup(false)}
              >
                <img className="h-6 w-6" src={iconCancelar} alt="Cancelar" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor principal */}
      
      <div className="bg-white p-4 md:p-6 rounded-md w-max">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-4 md:mb-6">
          Hive (Desplegado)
        </h1>

        {/* Controles superiores - Responsive */}
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

        {/* Tabla responsive */}
        <div className="bg-gray-200 p-2 md:p-4 rounded-lg overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            {/* Versión para móviles (tarjetas) */}
            <div className="md:hidden space-y-3">
              {filteredInformation.map((item) => {
                const ahora = new Date().getTime() / 1000;
                const tiempoItem = item.tiempo;
                const diferenciaMinutos = (ahora - tiempoItem) / 60;
                const esNuevo = diferenciaMinutos <= 1; // Menos de 1 minuto = nuevo (limbo)
                const sinNovedad = diferenciaMinutos > 5; // Más de 5 minutos = sin novedad

                return (
                  <div key={item.id} className="bg-white p-3 rounded-md shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{item.nodo}</p>
                        <p className="text-sm text-gray-600">ID: {item.id}</p>
                      </div>
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${
                          esNuevo
                            ? "bg-yellow-500"
                            : sinNovedad
                            ? "bg-green-500"
                            : "bg-red-500"
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
                        <p>
                          {esNuevo
                            ? "Limbo"
                            : sinNovedad
                            ? "Sin novedad"
                            : "Novedad"}
                        </p>
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
                  const esNuevo = diferenciaMinutos <= 1; // Menos de 1 minuto = nuevo (limbo)
                  const sinNovedad = diferenciaMinutos > 5; // Más de 5 minutos = sin novedad

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
                              esNuevo
                                ? "bg-yellow-500"
                                : sinNovedad
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></span>
                          {esNuevo
                            ? "Limbo"
                            : sinNovedad
                            ? "Sin novedad"
                            : "Novedad"}
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
