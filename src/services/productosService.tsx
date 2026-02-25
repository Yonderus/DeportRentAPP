import { supabase } from "../utils/supabaseClient";
import { decode } from "base64-arraybuffer";
import { Producto, TallaProducto } from "../types/types";

const PRODUCT_IMAGES_BUCKET = "imagenes-productos";
const DEFAULT_IMAGE_EXT = "jpg";

const toDbProducto = (data: Partial<Omit<Producto, "id">>) =>
  Object.fromEntries(
    Object.entries({
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio_dia: data.precioDia,
      precio_venta: data.precioVenta,
      image_path: data.imagePath,
      activo: data.activo,
    }).filter(([, value]) => value !== undefined)
  );

const toDbTalla = (data: Partial<Omit<TallaProducto, "id">>) => ({
  producto_id: data.productoId,
  codigo_talla: data.codigoTalla,
  descripcion: data.descripcion,
  activo: data.activo,
});

export const getProductos = async (): Promise<Producto[]> => {
  const { data, error } = await supabase
    .from("productos")
    .select("id,nombre,descripcion,precioDia:precio_dia,precioVenta:precio_venta,imagePath:image_path,activo")
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
    .select("id,nombre,descripcion,precioDia:precio_dia,precioVenta:precio_venta,imagePath:image_path,activo")
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
    .select("id,nombre,descripcion,precioDia:precio_dia,precioVenta:precio_venta,imagePath:image_path,activo")
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

const getFileExtensionFromUri = (uri: string) => {
  const cleanUri = uri.split("?")[0];
  const dotIndex = cleanUri.lastIndexOf(".");
  if (dotIndex === -1) return DEFAULT_IMAGE_EXT;
  return cleanUri.substring(dotIndex + 1).toLowerCase();
};

const getContentTypeFromExtension = (ext: string) => {
  switch (ext) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "heic":
    case "heif":
      return "image/heic";
    default:
      return "image/jpeg";
  }
};

export const uploadProductoImage = async (
  productId: number,
  base64Data: string,
  options?: { extension?: string; mimeType?: string }
) => {
  if (!productId || !base64Data) {
    throw new Error("Falta productId o los datos base64");
  }

  const rawExtension = options?.extension ?? DEFAULT_IMAGE_EXT;
  const extension = rawExtension.replace(".", "").toLowerCase();
  const contentType = options?.mimeType ?? getContentTypeFromExtension(extension);
  const imagePath = `productos/${productId}/principal.${extension}`;
  const fileBuffer = decode(base64Data);

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(imagePath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) throw new Error(error.message);
  return imagePath;
};

export const getSignedProductImageUrl = async (
  imagePath: string,
  expiresInSeconds = 60 * 60
) => {
  if (!imagePath) return null;

  const { data, error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .createSignedUrl(imagePath, expiresInSeconds);

  if (error) throw new Error(error.message);
  return data?.signedUrl ?? null;
};
