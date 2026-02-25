import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Producto } from "../types/types";

export type CarritoItem = {
  producto: Producto;
  cantidad: number;
  imageUrl?: string | null;
};

type CarritoState = {
  items: CarritoItem[];
  addProducto: (producto: Producto, imageUrl?: string | null) => void;
  removeProducto: (productoId: number) => void;
  incrementarCantidad: (productoId: number) => void;
  decrementarCantidad: (productoId: number) => void;
  clearCarrito: () => void;
};

export const useCarritoStore = create<CarritoState>()(
  persist(
    (set) => ({
      items: [],
      addProducto: (producto, imageUrl) =>
        set((state) => {
          const existing = state.items.find((item) => item.producto.id === producto.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.producto.id === producto.id
                  ? { ...item, cantidad: item.cantidad + 1, imageUrl: imageUrl ?? item.imageUrl }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { producto, cantidad: 1, imageUrl: imageUrl ?? null }],
          };
        }),
      removeProducto: (productoId) =>
        set((state) => ({
          items: state.items.filter((item) => item.producto.id !== productoId),
        })),
      incrementarCantidad: (productoId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.producto.id === productoId ? { ...item, cantidad: item.cantidad + 1 } : item
          ),
        })),
      decrementarCantidad: (productoId) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.producto.id === productoId ? { ...item, cantidad: item.cantidad - 1 } : item
            )
            .filter((item) => item.cantidad > 0),
        })),
      clearCarrito: () => set({ items: [] }),
    }),
    {
      name: "carrito-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
