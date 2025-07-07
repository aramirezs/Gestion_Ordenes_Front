import { useEffect, useState } from 'react'
import { useOrderStore } from '../stores/orderStore'
import orderService from '../services/orderService'
import OrderFormModal from './OrderFormModal'
import { PlusCircle, Search, Edit2, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function OrdersPage() {
  const { orders, setOrders, setSelectedOrder } = useOrderStore()

  const [cliente, setCliente] = useState('')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [ordenarPor, setOrdenarPor] = useState('FechaCreacion')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const fetchOrders = async () => {
    try {
      const params = {
        cliente,
        ordenarPor,
        page,
        pageSize,
      }

      if (desde) params.desde = new Date(desde).toISOString().split('T')[0]
      if (hasta) params.hasta = new Date(hasta).toISOString().split('T')[0]

      const response = await orderService.getOrders(params)

      const items = response?.data?.data?.items
      const pages = response?.data?.data?.pages

      setOrders(Array.isArray(items) ? items : []) 
      setTotalPages(typeof pages === 'number' && pages > 0 ? pages : 1)
    } catch (error) {
      console.error('Error al obtener órdenes:', error)
      setOrders([]) 
      setTotalPages(1)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [page])

  const handleBuscar = () => {
    setPage(1)
    fetchOrders()
  }

  const handleCreate = () => {
    setSelectedOrder(null)
    setIsEditing(false)
    setIsModalOpen(true)
  }

  const handleEdit = (order) => {
    setSelectedOrder(order)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (confirm('¿Está seguro de eliminar la orden?')) {
      try {
        await orderService.deleteOrder(id)
        toast.success('Orden anulada correctamente')
        setPage(1)
        fetchOrders()
      } catch (error) {
        console.error('Error al anular la orden:', error)
        toast.error('Hubo un error al anular la orden')
      }
    }
  }

  const isArray = Array.isArray(orders)

  return (
    <div className="p-4 bg-[#f8fafd] min-h-screen">
      <h1 className="text-2xl font-bold text-[#0057a3] mb-4">Listado de Órdenes</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleBuscar()
        }}
        className="grid md:grid-cols-6 sm:grid-cols-2 gap-4 mb-6 items-end"
      >
        <input
          type="text"
          placeholder="Buscar cliente"
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#0057a3]"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
        />
        <input
          type="date"
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#0057a3]"
          value={desde}
          onChange={(e) => setDesde(e.target.value)}
        />
        <input
          type="date"
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#0057a3]"
          value={hasta}
          onChange={(e) => setHasta(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#0057a3]"
          value={ordenarPor}
          onChange={(e) => setOrdenarPor(e.target.value)}
        >
          <option value="FechaCreacion">Fecha de creación</option>
          <option value="Cliente">Cliente</option>
          <option value="OrdenId">ID</option>
        </select>

        <button
          type="button"
          className="bg-white text-[#2d66f7] px-4 py-2 border border-[#2d66f7] rounded flex items-center gap-2 hover:bg-[#f0f4ff]"
          onClick={handleCreate}
        >
          <PlusCircle size={18} /> Nueva Orden
        </button>

        <button
          type="submit"
          className="bg-[#2d66f7] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-[#1e50d0]"
        >
          <Search size={18} /> Buscar
        </button>
      </form>

      <div className="overflow-x-auto rounded shadow border border-gray-200">
        {!isArray || orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m4-4h.01M15 11a4 4 0 110-8 4 4 0 010 8zM21 17v-2a4 4 0 00-3-3.87"
              />
            </svg>
            <p className="text-gray-500">No hay órdenes encontradas</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-[#e1ecf8]">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-6 py-2 border w-2/5">Cliente</th>
                <th className="px-2 py-2 border w-1/5">Fecha</th>
                <th className="px-4 py-2 border">Total</th>
                <th className="px-4 py-2 border text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.ordenId} className="hover:bg-[#f1f6fc]">
                  <td className="px-4 py-2 border">{order.ordenId}</td>
                  <td className="px-6 py-2 border">{order.cliente}</td>
                  <td className="px-2 py-2 border">{order.fechaCreacion}</td>
                  <td className="px-4 py-2 border">{order.total}</td>
                  <td className="px-4 py-2 border">
                    <div className="flex justify-center gap-2">
                      <button
                        className="text-[#007acc] hover:underline flex items-center gap-1"
                        onClick={() => handleEdit(order)}
                        title="Editar orden"
                      >
                        <Edit2 size={16} /> Editar
                      </button>
                      <button
                        className="text-red-500 hover:underline flex items-center gap-1"
                        onClick={() => handleDelete(order.ordenId)}
                        title="Anular orden"
                      >
                        <Trash2 size={16} /> Anular
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isArray && orders.length > 0 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50 text-[#2d66f7]"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            « Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 border rounded ${i + 1 === page ? 'bg-[#2d66f7] text-white' : 'text-[#2d66f7]'}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 border rounded disabled:opacity-50 text-[#2d66f7]"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Siguiente »
          </button>
        </div>
      )}

      <OrderFormModal
        isOpen={isModalOpen}
        onClose={(nuevaOrden) => {
          setIsModalOpen(false)
          if (nuevaOrden && !isEditing) {
            setPage(1)
            setOrders((prev) => Array.isArray(prev) ? [nuevaOrden, ...prev] : [nuevaOrden])
          } else {
            fetchOrders()
          }
        }}
        isEditing={isEditing}
      />
    </div>
  )
}
