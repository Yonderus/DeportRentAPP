import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View, Text } from "react-native";
import { FAB } from "react-native-paper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTemaStore } from "./preferencias";
import { obtenerColores } from "../../theme";
import {
  getProductos,
  getTallasProducto,
  addProducto,
  updateProducto,
  deleteProducto,
  addTallaProducto,
  updateTallaProducto,
  deleteTallaProducto,
} from "../../services/productosService";
import { Producto, TallaProducto } from "../../types/types";
import { useUsuarioStore } from "../../stores/useUsuarioStore";
import ProductsItem from "../../components/productsComponents/productsItem";
import ProductsDialog, { ProductForm } from "../../components/productsComponents/productsDialog";
import ProductsActionModal from "../../components/productsComponents/productsActionModal";
import ProductSizeDialog, { SizeForm } from "../../components/productsComponents/productSizeDialog";
import ProductSizesModal from "../../components/productsComponents/productSizesModal";

export default function ProductosScreen() {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);
  const rol = useUsuarioStore((s) => s.rol);
  const isAdmin = rol === "ADMIN";
  const queryClient = useQueryClient();
  const [formVisible, setFormVisible] = useState(false);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [sizesVisible, setSizesVisible] = useState(false);
  const [sizeFormVisible, setSizeFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [editingSizeId, setEditingSizeId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>({
    nombre: "",
    descripcion: "",
    precioDia: "",
    precioVenta: "",
    activo: true,
  });
  const [sizeForm, setSizeForm] = useState<SizeForm>({
    codigoTalla: "",
    descripcion: "",
    activo: true,
  });
  const {
    data: productos = [],
    isLoading: isLoadingProductos,
    isError: isErrorProductos,
    error: errorProductos,
  } = useQuery({
    queryKey: ["productos"],
    queryFn: getProductos,
  });

  const {
    data: tallas = [],
    isLoading: isLoadingTallas,
    isError: isErrorTallas,
    error: errorTallas,
  } = useQuery({
    queryKey: ["tallasProducto"],
    queryFn: getTallasProducto,
  });

  const tallasPorProducto = useMemo(() => {
    const map = new Map<number, string[]>();
    tallas
      .filter((talla) => talla.activo)
      .forEach((talla) => {
        const list = map.get(talla.productoId) ?? [];
        list.push(talla.codigoTalla);
        map.set(talla.productoId, list);
      });
    return map;
  }, [tallas]);

  const isLoading = isLoadingProductos || isLoadingTallas;
  const isError = isErrorProductos || isErrorTallas;
  const errorMessage =
    (errorProductos as Error | undefined)?.message ??
    (errorTallas as Error | undefined)?.message ??
    "Error al cargar productos";

  const createMutation = useMutation({
    mutationFn: addProducto,
    onMutate: async (nuevo) => {
      await queryClient.cancelQueries({ queryKey: ["productos"] });
      const previous = queryClient.getQueryData<Producto[]>(["productos"]) ?? [];
      const optimistic: Producto = {
        id: -Date.now(),
        ...nuevo,
      } as Producto;
      queryClient.setQueryData<Producto[]>(["productos"], [optimistic, ...previous]);
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["productos"], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["productos"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Producto, "id">> }) =>
      updateProducto(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["productos"] });
      const previous = queryClient.getQueryData<Producto[]>(["productos"]) ?? [];
      queryClient.setQueryData<Producto[]>(
        ["productos"],
        previous.map((p) => (p.id === id ? { ...p, ...data } : p))
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["productos"], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["productos"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProducto,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["productos"] });
      const previous = queryClient.getQueryData<Producto[]>(["productos"]) ?? [];
      queryClient.setQueryData<Producto[]>(
        ["productos"],
        previous.filter((p) => p.id !== id)
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["productos"], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["productos"] }),
  });

  const createSizeMutation = useMutation({
    mutationFn: addTallaProducto,
    onMutate: async (nueva) => {
      await queryClient.cancelQueries({ queryKey: ["tallasProducto"] });
      const previous = queryClient.getQueryData<TallaProducto[]>(["tallasProducto"]) ?? [];
      const optimistic: TallaProducto = {
        id: -Date.now(),
        ...nueva,
      } as TallaProducto;
      queryClient.setQueryData<TallaProducto[]>(["tallasProducto"], [optimistic, ...previous]);
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["tallasProducto"], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tallasProducto"] }),
  });

  const updateSizeMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<TallaProducto, "id">> }) =>
      updateTallaProducto(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["tallasProducto"] });
      const previous = queryClient.getQueryData<TallaProducto[]>(["tallasProducto"]) ?? [];
      queryClient.setQueryData<TallaProducto[]>(
        ["tallasProducto"],
        previous.map((t) => (t.id === id ? { ...t, ...data } : t))
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["tallasProducto"], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tallasProducto"] }),
  });

  const deleteSizeMutation = useMutation({
    mutationFn: deleteTallaProducto,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["tallasProducto"] });
      const previous = queryClient.getQueryData<TallaProducto[]>(["tallasProducto"]) ?? [];
      queryClient.setQueryData<TallaProducto[]>(
        ["tallasProducto"],
        previous.filter((t) => t.id !== id)
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["tallasProducto"], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tallasProducto"] }),
  });

  const abrirCrear = () => {
    setEditingId(null);
    setForm({
      nombre: "",
      descripcion: "",
      precioDia: "",
      precioVenta: "",
      activo: true,
    });
    setFormVisible(true);
  };

  const abrirEditar = (producto: Producto) => {
    setEditingId(producto.id);
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? "",
      precioDia: String(producto.precioDia ?? ""),
      precioVenta: producto.precioVenta ? String(producto.precioVenta) : "",
      activo: producto.activo,
    });
    setFormVisible(true);
  };

  const guardar = async (data: ProductForm) => {
    const precioDia = Number(data.precioDia.replace(",", "."));
    const precioVenta = data.precioVenta.trim()
      ? Number(data.precioVenta.replace(",", "."))
      : null;

    const payload: Omit<Producto, "id"> = {
      nombre: data.nombre.trim(),
      descripcion: data.descripcion.trim() ? data.descripcion.trim() : undefined,
      precioDia: Number.isFinite(precioDia) ? precioDia : 0,
      precioVenta: Number.isFinite(precioVenta ?? 0) ? precioVenta : null,
      activo: data.activo,
    };

    if (editingId === null) {
      await createMutation.mutateAsync(payload);
    } else {
      await updateMutation.mutateAsync({ id: editingId, data: payload });
    }

    setFormVisible(false);
  };

  const abrirTallas = (producto: Producto) => {
    setSelectedProduct(producto);
    setSizesVisible(true);
  };

  const abrirCrearTalla = () => {
    setEditingSizeId(null);
    setSizeForm({ codigoTalla: "", descripcion: "", activo: true });
    setSizeFormVisible(true);
  };

  const abrirEditarTalla = (talla: TallaProducto) => {
    setEditingSizeId(talla.id);
    setSizeForm({
      codigoTalla: talla.codigoTalla,
      descripcion: talla.descripcion ?? "",
      activo: talla.activo,
    });
    setSizeFormVisible(true);
  };

  const guardarTalla = async (data: SizeForm) => {
    if (!selectedProduct) return;
    const payload: Omit<TallaProducto, "id"> = {
      productoId: selectedProduct.id,
      codigoTalla: data.codigoTalla.trim(),
      descripcion: data.descripcion.trim() ? data.descripcion.trim() : undefined,
      activo: data.activo,
    };

    if (editingSizeId === null) {
      await createSizeMutation.mutateAsync(payload);
    } else {
      await updateSizeMutation.mutateAsync({ id: editingSizeId, data: payload });
    }

    setSizeFormVisible(false);
  };

  const renderItem = ({ item }: { item: (typeof productos)[number] }) => {
    const tallas = tallasPorProducto.get(item.id)?.join(" · ") ?? "";

    return (
      <View>
        <ProductsItem
          producto={item}
          onPress={isAdmin ? (producto) => {
            setSelectedProduct(producto);
            setActionsVisible(true);
          } : undefined}
        />
        {tallas ? (
          <Text style={[styles.sizes, { color: colores.textoTerciario }]}>Tallas: {tallas}</Text>
        ) : null}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colores.fondoPrincipal }]}>
      <Text style={[styles.title, { color: colores.textoPrincipal }]}>Productos</Text>
      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={colores.btnPrimario} />
          <Text style={[styles.stateText, { color: colores.textoSecundario }]}>Cargando productos...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerState}>
          <Text style={[styles.stateText, { color: colores.enlaces }]}>{errorMessage}</Text>
        </View>
      ) : productos.filter((producto) => producto.activo).length === 0 ? (
        <View style={styles.centerState}>
          <Text style={[styles.stateText, { color: colores.textoSecundario }]}>No hay productos activos</Text>
        </View>
      ) : (
        <FlatList
          data={productos.filter((producto) => producto.activo)}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
      {isAdmin ? (
        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: colores.fabColor }]}
          onPress={abrirCrear}
          disabled={createMutation.isPending || updateMutation.isPending}
        />
      ) : null}

      <ProductsDialog
        visible={formVisible}
        title={editingId === null ? "Nuevo producto" : "Editar producto"}
        value={form}
        onChange={setForm}
        onCancel={() => setFormVisible(false)}
        onSave={guardar}
        saving={createMutation.isPending || updateMutation.isPending}
      />

      <ProductsActionModal
        visible={actionsVisible}
        producto={selectedProduct}
        onClose={() => setActionsVisible(false)}
        onEdit={(producto) => {
          setActionsVisible(false);
          abrirEditar(producto);
        }}
        onSizes={(producto) => {
          setActionsVisible(false);
          abrirTallas(producto);
        }}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      <ProductSizesModal
        visible={sizesVisible}
        producto={selectedProduct}
        tallas={
          selectedProduct
            ? tallas.filter((t) => t.productoId === selectedProduct.id)
            : []
        }
        onClose={() => setSizesVisible(false)}
        onAdd={abrirCrearTalla}
        onEdit={abrirEditarTalla}
        onDelete={(id) => deleteSizeMutation.mutate(id)}
      />

      <ProductSizeDialog
        visible={sizeFormVisible}
        title={editingSizeId === null ? "Nueva talla" : "Editar talla"}
        value={sizeForm}
        onChange={setSizeForm}
        onCancel={() => setSizeFormVisible(false)}
        onSave={guardarTalla}
        saving={createSizeMutation.isPending || updateSizeMutation.isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 100,
  },
  sizes: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 10,
    marginLeft: 12,
  },
  centerState: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: "center",
    gap: 12,
  },
  stateText: {
    fontSize: 14,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});
