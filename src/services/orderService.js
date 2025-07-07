import api from '../api/axios'

const getOrders = (params) => api.get('/Ordenes/listado', { params })
const createOrder = (payload) => api.post('/Ordenes', payload)
const updateOrder = (id, payload) => api.put(`/Ordenes/${id}`, payload)
const deleteOrder = (id) => api.delete(`/Ordenes/${id}`)
const getOrderById = (id) => api.get(`/Ordenes/${id}`)

export default {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderById,
}
