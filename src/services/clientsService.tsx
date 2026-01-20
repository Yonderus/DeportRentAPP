import { Client, clientsData } from "../data/clients";

let clientesData: Client[] = [...clientsData];

export const getClients = (): Client[] => {
  return [...clientesData];
};

export const getClientById = (id: number): Client | undefined => {
  return clientesData.find((c) => c.id === id);
};


export const addClient = (client: Omit<Client, "id">): Client => {
  const newId =
    clientesData.length > 0
      ? Math.max(...clientesData.map((c) => c.id)) + 1
      : 1;

  const nuevo: Client = {
    ...client,
    id: newId,
    pedidos: client.pedidos ?? [],
  };

  clientesData.push(nuevo);
  return nuevo;
};


export const updateClient = (
  id: number,
  cambios: Partial<Omit<Client, "id">>
): Client | undefined => {
  const actual = clientesData.find((c) => c.id === id);
  if (!actual) return undefined;

  const actualizado: Client = {
    ...actual,
    ...cambios,
    id,
    pedidos: cambios.pedidos ?? actual.pedidos,
  };

  clientesData = clientesData.map((c) =>
    c.id === id ? actualizado : c
  );

  return actualizado;
};


export const deleteClient = (id: number): void => {
  clientesData = clientesData.filter((c) => c.id !== id);
};
