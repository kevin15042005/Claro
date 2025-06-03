import iconSave from "../../assets/icons/save.svg";
import iconCancelar from "../../assets/icons/cancelar.svg";

export default function EliminarPopup({
  idOperacion,
  information,
  handleDelete,
  setShowDeletePopup,
}) {
  return (
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
  );
}