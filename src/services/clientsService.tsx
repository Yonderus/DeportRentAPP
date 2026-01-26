import { Cliente, clientes } from "../types/types";

let clientesData: Cliente[] = [...clientes];

export const getClients = (): Cliente[] => {
  return [...clientesData];
};

export const getClientById = (id: number): Cliente | undefined => {
  return clientesData.find((c) => c.id === id);
};


export const addClient = (client: Omit<Cliente, "id">): Cliente => {
  const newId =
    clientesData.length > 0
      ? Math.max(...clientesData.map((c) => c.id)) + 1
      : 1;

  const nuevo: Cliente = {
    ...client,
    id: newId,
  };

  clientesData.push(nuevo);
  return nuevo;
};


export const updateClient = (
  id: number,
  cambios: Partial<Omit<Cliente, "id">>
): Cliente | undefined => {
  const actual = clientesData.find((c) => c.id === id);
  if (!actual) return undefined;

  const actualizado: Cliente = {
    ...actual,
    ...cambios,
    id,
  };

  clientesData = clientesData.map((c) =>
    c.id === id ? actualizado : c
  );

  return actualizado;
};


export const deleteClient = (id: number): void => {
  clientesData = clientesData.filter((c) => c.id !== id);
};
