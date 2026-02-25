import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Producto, TallaProducto } from "../types/types";

export type CarritoModalidad = "ALQUILER" | "COMPRA";

const LEGACY_TALLA: Pick<TallaProducto, "id" | "codigoTalla"> = {
  id: -1,
  codigoTalla: "Sin talla",
};

export type CarritoItem = {
  producto: Producto;
  talla: Pick<TallaProducto, "id" | "codigoTalla">;
  cantidad: number;
  modalidad: CarritoModalidad;
  precioUnitario: number;
  imageUrl?: string | null;
};

type CarritoState = {
  items: CarritoItem[];
  addProducto: (
    producto: Producto,
    talla: Pick<TallaProducto, "id" | "codigoTalla">,
    modalidad: CarritoModalidad,
    imageUrl?: string | null
  ) => void;
  removeProducto: (productoId: number, tallaId: number, modalidad: CarritoModalidad) => void;
  incrementarCantidad: (productoId: number, tallaId: number, modalidad: CarritoModalidad) => void;
  decrementarCantidad: (productoId: number, tallaId: number, modalidad: CarritoModalidad) => void;
  clearCarrito: () => void;
};

const getMatch = (
  item: CarritoItem,
  productoId: number,
  tallaId: number,
  modalidad: CarritoModalidad
) =>
  item.producto.id === productoId &&
  (item.talla?.id ?? LEGACY_TALLA.id) === tallaId &&
  (item.modalidad ?? "ALQUILER") === modalidad;

const getPrecioUnitario = (producto: Producto, modalidad: CarritoModalidad) =>
  modalidad === "COMPRA"
    ? Number(producto.precioVenta ?? producto.precioDia ?? 0)
    : Number(producto.precioDia ?? 0);

const normalizeLegacyItem = (item: any): CarritoItem => {
  const modalidad: CarritoModalidad = item?.modalidad === "COMPRA" ? "COMPRA" : "ALQUILER";
  const producto = item?.producto as Producto;

  return {
    producto,
    talla: item?.talla && typeof item.talla.id === "number" ? item.talla : LEGACY_TALLA,
    cantidad: Number.isFinite(item?.cantidad) ? item.cantidad : 1,
    modalidad,
    precioUnitario: Number.isFinite(item?.precioUnitario)
      ? item.precioUnitario
      : getPrecioUnitario(producto, modalidad),
    imageUrl: item?.imageUrl ?? null,
  };
};

export const useCarritoStore = create<CarritoState>()(
  persist(
    (set) => ({
      items: [],
      addProducto: (producto, talla, modalidad, imageUrl) =>
        set((state) => {
          const existing = state.items.find((item) =>
            getMatch(item, producto.id, talla.id, modalidad)
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                getMatch(item, producto.id, talla.id, modalidad)
                  ? {
                      ...item,
                      cantidad: item.cantidad + 1,
                      imageUrl: imageUrl ?? item.imageUrl,
                      talla,
                      precioUnitario: getPrecioUnitario(producto, modalidad),
                    }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                producto,
                talla,
                modalidad,
                precioUnitario: getPrecioUnitario(producto, modalidad),
                cantidad: 1,
                imageUrl: imageUrl ?? null,
              },
            ],
          };
        }),
      removeProducto: (productoId, tallaId, modalidad) =>
        set((state) => ({
          items: state.items.filter((item) => !getMatch(item, productoId, tallaId, modalidad)),
        })),
      incrementarCantidad: (productoId, tallaId, modalidad) =>
        set((state) => ({
          items: state.items.map((item) =>
            getMatch(item, productoId, tallaId, modalidad)
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          ),
        })),
      decrementarCantidad: (productoId, tallaId, modalidad) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              getMatch(item, productoId, tallaId, modalidad)
                ? { ...item, cantidad: item.cantidad - 1 }
                : item
            )
            .filter((item) => item.cantidad > 0),
        })),
      clearCarrito: () => set({ items: [] }),
    }),
    {
      name: "carrito-store",
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as Partial<CarritoState> | undefined;
        if (!state?.items || !Array.isArray(state.items)) return { items: [] };
        return {
          ...state,
          items: state.items.map((item) => normalizeLegacyItem(item)),
        };
      },
    }
  )
);
