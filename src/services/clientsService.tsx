import { supabase } from "../lib/supabaseClient";
import { Cliente } from "../types/types";

const toDb = (client: Partial<Omit<Cliente, "id">>) => ({
  nombre: client.nombre,
  telefono: client.telefono,
  email: client.email,
  nif_cif: client.nifCif,
  notas: client.notas,
  activo: client.activo,
});

export const getClients = async (): Promise<Cliente[]> => {
  const { data, error } = await supabase
    .from("clientes")
    .select("id,nombre,telefono,email,nifCif:nif_cif,notas,activo")
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
};

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

export const addClient = async (client: Omit<Cliente, "id">): Promise<Cliente> => {
  const { data, error } = await supabase
    .from("clientes")
    .insert(toDb(client))
    .select("id,nombre,telefono,email,nifCif:nif_cif,notas,activo")
    .single();

  if (error) throw new Error(error.message);
  return data as Cliente;
};

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

export const deleteClient = async (id: number): Promise<void> => {
  const { error } = await supabase.from("clientes").delete().eq("id", id);
  if (error) throw new Error(error.message);
};
