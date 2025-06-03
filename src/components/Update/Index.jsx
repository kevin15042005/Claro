import iconSave from "../../assets/icons/save.svg";
import iconExit from "../../assets/icons/exit.svg";

export default function ActualizarPopup({
  idOperacion,
  nodo,
  setNodo,
  technology,
  setTechnology,
  tipo,
  setTipo,
  selectedItem,
  setShowUpdateConfirmPopup,
  setShowUpdatePopup,
}) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(255,255,255,0.8)" }}
    >
      <div className="bg-red-700 p-4 rounded-md w-full max-w-md mx-4 my-8">
        <section className="my-2 bg-white rounded-md p-3">
          <h3 className="font-bold text-lg text-center">Actualizar Registro</h3>
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
  );
}