import { supabase } from "../lib/supabaseClient";
import { Producto, TallaProducto } from "../types/types";

const toDbProducto = (data: Partial<Omit<Producto, "id">>) => ({
  nombre: data.nombre,
  descripcion: data.descripcion,
  precio_dia: data.precioDia,
  precio_venta: data.precioVenta ?? null,
  activo: data.activo,
});

const toDbTalla = (data: Partial<Omit<TallaProducto, "id">>) => ({
  producto_id: data.productoId,
  codigo_talla: data.codigoTalla,
  descripcion: data.descripcion,
  activo: data.activo,
});

export const getProductos = async (): Promise<Producto[]> => {
  const { data, error } = await supabase
    .from("productos")
    .select("id,nombre,descripcion,precioDia:precio_dia,precioVenta:precio_venta,activo")
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
};

export const addProducto = async (
  producto: Omit<Producto, "id">
): Promise<Producto> => {
  const { data, error } = await supabase
    .from("productos")
    .insert(toDbProducto(producto))
    .select("id,nombre,descripcion,precioDia:precio_dia,precioVenta:precio_venta,activo")
    .single();

  if (error) throw new Error(error.message);
  return data as Producto;
};

export const updateProducto = async (
  id: number,
  cambios: Partial<Omit<Producto, "id">>
): Promise<Producto> => {
  const { data, error } = await supabase
    .from("productos")
    .update(toDbProducto(cambios))
    .eq("id", id)
    .select("id,nombre,descripcion,precioDia:precio_dia,precioVenta:precio_venta,activo")
    .single();

  if (error) throw new Error(error.message);
  return data as Producto;
};

export const deleteProducto = async (id: number): Promise<void> => {
  const { error } = await supabase.from("productos").delete().eq("id", id);
  if (error) throw new Error(error.message);
};

export const getTallasProducto = async (): Promise<TallaProducto[]> => {
  const { data, error } = await supabase
    .from("tallas_producto")
    .select("id,productoId:producto_id,codigoTalla:codigo_talla,descripcion,activo")
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
};

export const addTallaProducto = async (
  talla: Omit<TallaProducto, "id">
): Promise<TallaProducto> => {
  const { data, error } = await supabase
    .from("tallas_producto")
    .insert(toDbTalla(talla))
    .select("id,productoId:producto_id,codigoTalla:codigo_talla,descripcion,activo")
    .single();

  if (error) throw new Error(error.message);
  return data as TallaProducto;
};

export const updateTallaProducto = async (
  id: number,
  cambios: Partial<Omit<TallaProducto, "id">>
): Promise<TallaProducto> => {
  const { data, error } = await supabase
    .from("tallas_producto")
    .update(toDbTalla(cambios))
    .eq("id", id)
    .select("id,productoId:producto_id,codigoTalla:codigo_talla,descripcion,activo")
    .single();

  if (error) throw new Error(error.message);
  return data as TallaProducto;
};

export const deleteTallaProducto = async (id: number): Promise<void> => {
  const { error } = await supabase.from("tallas_producto").delete().eq("id", id);
  if (error) throw new Error(error.message);
};
