import { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { getTodasOrdenes, actualizarStatus } from "../api/ordenes";
import OrdenDetalleModal from "../components/OrdenDetalleModal";

const STATUSES = ["pendiente", "confirmada", "preparando", "lista", "entregada", "cancelada"];

const STATUS_COLOR = {
  pendiente: "bg-yellow-100 text-yellow-800",
  confirmada: "bg-blue-100 text-blue-800",
  preparando: "bg-orange-100 text-orange-800",
  lista: "bg-purple-100 text-purple-800",
  entregada: "bg-green-100 text-green-800",
  cancelada: "bg-red-100 text-red-800",
};

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [sorting, setSorting] = useState([{ id: "creadoEn", desc: true }]);

  const cargarOrdenes = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTodasOrdenes();
      setOrdenes(data.ordenes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const handleStatusChange = async (id, nuevoStatus) => {
    setUpdatingId(id);
    try {
      await actualizarStatus(id, nuevoStatus);
      setOrdenes((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: nuevoStatus } : o))
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtrado: status + búsqueda de texto (nombre/email/id)
  const datosFiltrados = useMemo(() => {
    return ordenes.filter((o) => {
      const matchStatus = statusFiltro === "todos" || o.status === statusFiltro;
      const texto = search.toLowerCase();
      const matchTexto =
        !texto ||
        o.usuario.nombre.toLowerCase().includes(texto) ||
        o.usuario.email.toLowerCase().includes(texto) ||
        String(o.id).includes(texto);
      return matchStatus && matchTexto;
    });
  }, [ordenes, statusFiltro, search]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: (info) => `#${info.getValue()}`,
      },
      {
        id: "cliente",
        header: "Cliente",
        accessorFn: (row) => row.usuario.nombre,
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.usuario.nombre}</div>
            <div className="text-gray-400 text-xs">{row.original.usuario.email}</div>
          </div>
        ),
      },
      {
        id: "items",
        header: "Items",
        cell: ({ row }) =>
          row.original.items.map((i) => `${i.cantidad}x ${i.producto.nombre}`).join(", "),
      },
      {
        accessorKey: "total",
        header: "Total",
        cell: (info) => `$${info.getValue().toFixed(2)}`,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <select
            value={row.original.status}
            disabled={updatingId === row.original.id}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => handleStatusChange(row.original.id, e.target.value)}
            className={`text-xs font-medium px-2 py-1 rounded border-0 ${STATUS_COLOR[row.original.status]}`}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        ),
      },
      {
        accessorKey: "creadoEn",
        header: "Fecha",
        cell: (info) => new Date(info.getValue()).toLocaleString("es-MX"),
      },
    ],
    [updatingId]
  );

  const table = useReactTable({
  data: datosFiltrados,
  columns,
  state: { sorting },
  onSortingChange: setSorting,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  initialState: { pagination: { pageSize: 10 } },
});

  if (loading) return <p className="text-gray-500">Cargando órdenes...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h1 className="text-xl font-bold">Órdenes ({datosFiltrados.length})</h1>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar por cliente, email o ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-1.5 text-sm w-64"
          />
          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
            className="border rounded px-3 py-1.5 text-sm"
          >
            <option value="todos">Todos los status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{ asc: " ↑", desc: " ↓" }[header.column.getIsSorted()] ?? ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setOrdenSeleccionada(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-400">
                  No hay órdenes que coincidan con el filtro
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t bg-white rounded-b-lg">
        <span className="text-sm text-gray-500">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount() || 1}
        </span>

        <div className="flex gap-2">
            <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 text-sm border rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
            Anterior
            </button>
            <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 text-sm border rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
            Siguiente
            </button>
        </div>
      </div>

      <OrdenDetalleModal
        orden={ordenSeleccionada}
        onClose={() => setOrdenSeleccionada(null)}
      />
    </div>
  );
}