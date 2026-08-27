export default function OrdenDetalleModal({ orden, onClose }) {
  if (!orden) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">Orden #{orden.id}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <p className="text-sm text-gray-500">Cliente</p>
            <p className="font-medium">{orden.usuario.nombre}</p>
            <p className="text-sm text-gray-500">{orden.usuario.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Fecha</p>
            <p>{new Date(orden.creadoEn).toLocaleString("es-MX")}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Items</p>
            <div className="space-y-2">
              {orden.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm border-b pb-2">
                  <span>{item.cantidad}x {item.producto.nombre}</span>
                  <span className="text-gray-600">
                    ${(item.precio * item.cantidad).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total</span>
            <span>${orden.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}