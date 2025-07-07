import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useOrderStore } from '../stores/orderStore'
import orderService from '../services/orderService'
import { Pencil } from 'lucide-react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function OrderFormModal({ isOpen, onClose, isEditing }) {
  const { selectedOrder, setSelectedOrder } = useOrderStore()

  const {
    register,
    handleSubmit,
    reset,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cliente: '',
      detalles: [{ producto: '', cantidad: 1, precioUnitario: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'detalles',
  })

  // Limpiar formulario cuando se abre para nuevo registro
  useEffect(() => {
    if (isOpen && !isEditing) {
      reset({
        cliente: '',
        detalles: [{ producto: '', cantidad: 1, precioUnitario: 0 }],
      })
    }
  }, [isOpen, isEditing, reset])

  // Cargar datos si está editando
  useEffect(() => {
    if (isEditing && selectedOrder) {
      reset({
        cliente: selectedOrder.cliente,
        detalles: selectedOrder.detalles.length > 0 ? selectedOrder.detalles : [{ producto: '', cantidad: 1, precioUnitario: 0 }],
      })
    }
  }, [isEditing, selectedOrder, reset])

  const onSubmit = async (data) => {
    if (!data.detalles || data.detalles.length === 0) {
      toast.error('Debe agregar al menos un producto a la orden')
      return
    }

    const detalleInvalido = data.detalles.find(
      (d) => d.cantidad <= 0 || d.precioUnitario < 0
    )
    if (detalleInvalido) {
      toast.error('La cantidad debe ser mayor a 0 y el precio no puede ser negativo')
      return
    }

    const payload = isEditing ? data : { orden: data }

    try {
      if (isEditing) {
        await orderService.updateOrder(selectedOrder.ordenId, payload)
        toast.success('Orden actualizada correctamente')
      } else {
        await orderService.createOrder(payload)
        toast.success('Orden registrada correctamente')
        reset({
          cliente: '',
          detalles: [{ producto: '', cantidad: 1, precioUnitario: 0 }],
        })
      }
      setSelectedOrder(null)
      onClose()
    } catch (error) {
      console.error('Error al guardar la orden:', error)
      toast.error('Hubo un error al guardar la orden')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-xl font-bold text-[#0057a3] flex items-center gap-2 mb-6">
          {isEditing && <Pencil size={20} />} {isEditing ? 'Editar Orden' : 'Nueva Orden'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#2b3a59] mb-1">Nombre del Cliente</label>
            <input
              className={`border w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${errors.cliente ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-[#0057a3]'}`}
              {...register('cliente', { required: 'Este campo es obligatorio' })}
              placeholder="Ingrese el nombre del cliente"
            />
            {errors.cliente && <p className="text-red-500 text-sm mt-1">{errors.cliente.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#2b3a59] mb-2">Productos</label>
            {fields.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m4-4h.01M15 11a4 4 0 110-8 4 4 0 010 8zM21 17v-2a4 4 0 00-3-3.87" />
                </svg>
                No hay productos registrados
              </div>
            )}
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-2 items-center mb-2">
                <div className="col-span-5">
                  <label className="text-xs block mb-1 text-gray-700">Producto</label>
                  <input
                    className={`border px-3 py-2 rounded w-full ${errors?.detalles?.[index]?.producto ? 'border-red-500' : ''}`}
                    {...register(`detalles.${index}.producto`, { required: 'Producto requerido' })}
                    placeholder="Nombre del producto"
                  />
                </div>
                <div className="col-span-3">
                  <label className="text-xs block mb-1 text-gray-700">Cantidad</label>
                  <input
                    type="number"
                    className={`border px-3 py-2 rounded w-full ${errors?.detalles?.[index]?.cantidad ? 'border-red-500' : ''}`}
                    {...register(`detalles.${index}.cantidad`, {
                      required: 'Cantidad requerida',
                      valueAsNumber: true,
                      min: { value: 1, message: 'Cantidad debe ser mayor que 0' },
                    })}
                    placeholder="Cantidad"
                  />
                  {errors?.detalles?.[index]?.cantidad && (
                    <p className="text-red-500 text-sm mt-1">{errors.detalles[index].cantidad.message}</p>
                  )}
                </div>
                <div className="col-span-3">
                  <label className="text-xs block mb-1 text-gray-700">Precio Unitario</label>
                  <input
                    type="number"
                    className={`border px-3 py-2 rounded w-full ${errors?.detalles?.[index]?.precioUnitario ? 'border-red-500' : ''}`}
                    {...register(`detalles.${index}.precioUnitario`, {
                      required: 'Precio requerido',
                      valueAsNumber: true,
                      min: { value: 0, message: 'Precio no puede ser negativo' },
                    })}
                    placeholder="Precio"
                  />
                  {errors?.detalles?.[index]?.precioUnitario && (
                    <p className="text-red-500 text-sm mt-1">{errors.detalles[index].precioUnitario.message}</p>
                  )}
                </div>
                <div className="col-span-1 pt-6">
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 text-lg"
                    onClick={() => remove(index)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 text-sm text-[#0057a3] hover:underline"
              onClick={() => append({ producto: '', cantidad: 1, precioUnitario: 0 })}
            >
              + Agregar otro producto
            </button>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-[#0057a3] text-white hover:bg-[#004080]"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
