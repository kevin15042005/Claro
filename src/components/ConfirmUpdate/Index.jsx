import iconSave from "../../assets/icons/save.svg";
import iconCancelar from "../../assets/icons/cancelar.svg";

export default function ConfirmarActualizacion({
  idOperacion,
  nodo,
  technology,
  tipo,
  handleUpdate,
  setShowUpdateConfirmPopup,
}) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(255,255,255,0.8)" }}
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
  );
}