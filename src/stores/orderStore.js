import { create } from 'zustand'

export const useOrderStore = create((set) => ({
  orders: [],
  selectedOrder: null,
  setOrders: (orders) => set({ orders }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),
}))
