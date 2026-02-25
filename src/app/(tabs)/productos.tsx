import React, { useMemo, useState, useEffect } from "react";
import { ActivityIndicator, Alert, FlatList, View, Text } from "react-native";
import { FAB } from "react-native-paper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTemaStore } from "./preferencias";
import { obtenerColores } from "../../styles/theme";
import {
  getProductos,
  getTallasProducto,
  addProducto,
  updateProducto,
  deleteProducto,
  addTallaProducto,
  updateTallaProducto,
  deleteTallaProducto,
  uploadProductoImage,
  getSignedProductImageUrl,
} from "../../services/productosService";
import { Producto, TallaProducto } from "../../types/types";
import { useUsuarioStore } from "../../stores/useUsuarioStore";
import ProductsItem from "../../components/products/productsItem";
import ProductsDialog, { ProductForm } from "../../components/products/productsDialog";
import ProductsActionModal from "../../components/products/productsActionModal";
import ProductSizeDialog, { SizeForm } from "../../components/products/productSizeDialog";
import ProductSizesModal from "../../components/products/productSizesModal";
import ProductPreviewModal from "../../components/products/productPreviewModal";
import CartModal from "../../components/products/cartModal";
import { useCarritoStore } from "../../stores/useCarritoStore";
import { styles } from "../../styles/app/productos.styles";

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
  const [previewVisible, setPreviewVisible] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [editingSizeId, setEditingSizeId] = useState<number | null>(null);
  const [imageUrls, setImageUrls] = useState<Record<number, string>>({});
  const [form, setForm] = useState<ProductForm>({
    nombre: "",
    descripcion: "",
    precioDia: "",
    precioVenta: "",
    activo: true,
    imageUri: "",
    imageBase64: "",
    imageExt: "",
    imageMime: "",
  });
  const [sizeForm, setSizeForm] = useState<SizeForm>({
    codigoTalla: "",
    descripcion: "",
    activo: true,
  });
  const addProductoCarrito = useCarritoStore((s) => s.addProducto);
  const totalCarritoItems = useCarritoStore((s) =>
    s.items.reduce((sum, item) => sum + item.cantidad, 0)
  );
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

  useEffect(() => {
    let mounted = true;

    const loadImages = async () => {
      const entries = await Promise.all(
        productos
          .filter((producto) => producto.imagePath)
          .map(async (producto) => {
            try {
              const url = await getSignedProductImageUrl(producto.imagePath as string);
              return [producto.id, url] as const;
            } catch {
              return [producto.id, null] as const;
            }
          })
      );

      if (!mounted) return;

      const map: Record<number, string> = {};
      entries.forEach(([id, url]) => {
        if (url) map[id] = url;
      });
      setImageUrls(map);
    };

    loadImages();

    return () => {
      mounted = false;
    };
  }, [productos]);

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
      imageUri: "",
      imageBase64: "",
      imageExt: "",
      imageMime: "",
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
      imageUri: "",
      imageBase64: "",
      imageExt: "",
      imageMime: "",
    });
    setFormVisible(true);
  };

  const guardar = async (data: ProductForm) => {
    const precioDia = Number(data.precioDia.replace(",", "."));
    const precioVenta = data.precioVenta.trim()
      ? Number(data.precioVenta.replace(",", "."))
      : 0;

    const payload: Omit<Producto, "id"> = {
      nombre: data.nombre.trim(),
      descripcion: data.descripcion.trim() ? data.descripcion.trim() : undefined,
      precioDia: Number.isFinite(precioDia) ? precioDia : 0,
      precioVenta: Number.isFinite(precioVenta) ? precioVenta : 0,
      activo: data.activo,
    };

    if (editingId === null) {
      const created = await createMutation.mutateAsync(payload);
      if (data.imageBase64) {
        const imagePath = await uploadProductoImage(created.id, data.imageBase64, {
          extension: data.imageExt,
          mimeType: data.imageMime,
        });
        await updateMutation.mutateAsync({ id: created.id, data: { imagePath } });
      }
    } else {
      await updateMutation.mutateAsync({ id: editingId, data: payload });
      if (data.imageBase64) {
        const imagePath = await uploadProductoImage(editingId, data.imageBase64, {
          extension: data.imageExt,
          mimeType: data.imageMime,
        });
        await updateMutation.mutateAsync({ id: editingId, data: { imagePath } });
      }
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
          imageUrl={imageUrls[item.id]}
          onPress={
            (producto) => {
              setSelectedProduct(producto);
              if (isAdmin) {
                setActionsVisible(true);
              } else {
                setPreviewVisible(true);
              }
            }
          }
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
      ) : (
        <>
          <FAB
            icon="cart"
            style={[styles.fab, { backgroundColor: colores.fabColor }]}
            onPress={() => setCartVisible(true)}
          />
          {totalCarritoItems > 0 ? (
            <View style={[styles.cartBadge, { backgroundColor: colores.enlaces }]}>
              <Text style={[styles.cartBadgeText, { color: colores.textoInverso }]}>
                {totalCarritoItems}
              </Text>
            </View>
          ) : null}
        </>
      )}

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

      <ProductPreviewModal
        visible={previewVisible}
        producto={selectedProduct}
        imageUrl={selectedProduct ? imageUrls[selectedProduct.id] : null}
        onClose={() => setPreviewVisible(false)}
        onAddToCart={(producto) => {
          addProductoCarrito(producto, imageUrls[producto.id] ?? null);
          Alert.alert("Carrito", `${producto.nombre} añadido al carrito`);
          setPreviewVisible(false);
        }}
      />

      <CartModal visible={cartVisible} onClose={() => setCartVisible(false)} />
    </View>
  );
}
