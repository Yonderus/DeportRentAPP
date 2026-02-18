export interface Client {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    pedidos: string[];
}

export const clientsData: Client[] = [
    {
        id: 1,
        name: "Juan",
        surname: "Pérez",
        email: "",
        phone: "123456789",
        pedidos: ["Pedido1", "Pedido2"]
    },
    {
        id: 2,
        name: "María",
        surname: "Gómez",
        email: "",
        phone: "987654321",
        pedidos: ["Pedido3", "Pedido4"]
    }
];