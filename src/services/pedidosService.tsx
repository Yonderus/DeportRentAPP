import { supabase } from "../utils/supabaseClient";
import { Pedido } from "../types/types";

export type PedidoListItem = Pick<
	Pedido,
	"id" | "codigo" | "tipo" | "clienteId" | "fechaInicio" | "fechaFin" | "estado" | "notas"
> & {
	clienteNombre?: string | null;
};

const toDbPedido = (data: Partial<Omit<Pedido, "id">>) =>
	Object.fromEntries(
		Object.entries({
			codigo: data.codigo,
			tipo: data.tipo,
			cliente_id: data.clienteId,
			direccion_entrega_id: data.direccionEntregaId,
			direccion_recogida_id: data.direccionRecogidaId,
			fecha_inicio: data.fechaInicio,
			fecha_fin: data.fechaFin,
			estado: data.estado,
			creado_por: data.creadoPor,
			notas: data.notas,
		}).filter(([, value]) => value !== undefined)
	);

export const getPedidos = async (): Promise<PedidoListItem[]> => {
	const { data, error } = await supabase
		.from("pedidos")
		.select("id,codigo,tipo,clienteId:cliente_id,fechaInicio:fecha_inicio,fechaFin:fecha_fin,estado,notas")
		.order("fecha_inicio", { ascending: false });

	if (error) throw new Error(error.message);
	return data ?? [];
};

export const addPedido = async (pedido: Omit<Pedido, "id">): Promise<Pedido> => {
	const { data, error } = await supabase
		.from("pedidos")
		.insert(toDbPedido(pedido))
		.select(
			"id,codigo,tipo,clienteId:cliente_id,direccionEntregaId:direccion_entrega_id,direccionRecogidaId:direccion_recogida_id,fechaInicio:fecha_inicio,fechaFin:fecha_fin,estado,creadoPor:creado_por,notas,createdAt:created_at"
		)
		.single();

	if (error) throw new Error(error.message);
	return data as Pedido;
};

export const updatePedido = async (
	id: number,
	cambios: Partial<Omit<Pedido, "id">>
): Promise<Pedido> => {
	const { data, error } = await supabase
		.from("pedidos")
		.update(toDbPedido(cambios))
		.eq("id", id)
		.select(
			"id,codigo,tipo,clienteId:cliente_id,direccionEntregaId:direccion_entrega_id,direccionRecogidaId:direccion_recogida_id,fechaInicio:fecha_inicio,fechaFin:fecha_fin,estado,creadoPor:creado_por,notas,createdAt:created_at"
		)
		.single();

	if (error) throw new Error(error.message);
	return data as Pedido;
};

export const deletePedido = async (id: number): Promise<void> => {
	const { error } = await supabase.from("pedidos").delete().eq("id", id);
	if (error) throw new Error(error.message);
};
