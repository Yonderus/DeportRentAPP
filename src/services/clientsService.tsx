// Servicios CRUD de clientes en Supabase.
// Todo acceso a la tabla clientes pasa por aquí para centralizar validaciones y mapeos.
import { supabase } from "../lib/supabaseClient";
import { Cliente } from "../types/types";

// Mapeo de campos UI -> DB (nifCif -> nif_cif).
// Esto evita tener que usar nombres de columnas DB en los componentes.
const toDb = (client: Partial<Omit<Cliente, "id">>) => ({
  nombre: client.nombre,
  telefono: client.telefono,
  email: client.email,
  nif_cif: client.nifCif,
  notas: client.notas,
  activo: client.activo,
});

// Obtener lista de clientes.
// Seleccionamos columnas concretas para reducir payload y mapear a nombres UI.
export const getClients = async (): Promise<Cliente[]> => {
  const { data, error } = await supabase
    .from("clientes")
    .select("id,nombre,telefono,email,nifCif:nif_cif,notas,activo")
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
};

// Obtener un cliente por id.
// .single() devuelve un único registro y simplifica el uso en detalle.
export const getClientById = async (id: number): Promise<Cliente | null> => {
  const { data, error } = await supabase
    .from("clientes")
    .select("id,nombre,telefono,email,nifCif:nif_cif,notas,activo")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }
  return data ?? null;
};

// Crear cliente.
// Devuelve el registro insertado para refrescar UI sin reconsultar.
export const addClient = async (client: Omit<Cliente, "id">): Promise<Cliente> => {
  const { data, error } = await supabase
    .from("clientes")
    .insert(toDb(client))
    .select("id,nombre,telefono,email,nifCif:nif_cif,notas,activo")
    .single();

  if (error) throw new Error(error.message);
  return data as Cliente;
};

// Actualizar cliente.
// Se usa en edición desde listado o detalle.
export const updateClient = async (
  id: number,
  cambios: Partial<Omit<Cliente, "id">>
): Promise<Cliente> => {
  const { data, error } = await supabase
    .from("clientes")
    .update(toDb(cambios))
    .eq("id", id)
    .select("id,nombre,telefono,email,nifCif:nif_cif,notas,activo")
    .single();

  if (error) throw new Error(error.message);
  return data as Cliente;
};

// Eliminar cliente.
// No devuelve nada; la UI se actualiza con React Query.
export const deleteClient = async (id: number): Promise<void> => {
  const { error } = await supabase.from("clientes").delete().eq("id", id);
  if (error) throw new Error(error.message);
};
