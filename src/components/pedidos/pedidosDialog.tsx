import React, { useMemo, useState } from "react";
import {
  Modal,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import { Cliente, EstadoPedido } from "../../types/types";
import { useTemaStore } from "../../app/(tabs)/preferencias";
import { obtenerColores } from "../../styles/theme";
import { styles } from "../../styles/components/pedidosDialog.styles";

export type PedidoForm = {
  codigo: string;
  tipo: string;
  clienteId: number | null;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoPedido;
  notas: string;
};

type Props = {
  visible: boolean;
  title: string;
  value: PedidoForm;
  onChange: (v: PedidoForm) => void;
  onCancel: () => void;
  onSave: (v: PedidoForm) => void;
  saving?: boolean;
  clientes: Cliente[];
  allowEdit?: boolean;
  allowStatusChange?: boolean;
};

const ESTADOS: EstadoPedido[] = [
  "PENDIENTE_REVISION",
  "PREPARADO",
  "ENTREGADO",
  "DEVUELTO",
  "FINALIZADO",
];

const RADIUS = 16;

export default function PedidosDialog({
  visible,
  title,
  value,
  onChange,
  onCancel,
  onSave,
  saving = false,
  clientes,
  allowEdit = true,
  allowStatusChange = true,
}: Props) {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);
  const [selectorVisible, setSelectorVisible] = useState(false);
  const inputDisabledStyle = !allowEdit
    ? [styles.inputDisabled, { backgroundColor: colores.fondoPrincipal }]
    : null;

  const clienteLabel = useMemo(() => {
    if (!value.clienteId) return "Selecciona un cliente";
    const cliente = clientes.find((c) => c.id === value.clienteId);
    return cliente ? cliente.nombre : `Cliente #${value.clienteId}`;
  }, [clientes, value.clienteId]);

  const aceptar = () => {
    if (saving) return;
    if (!value.codigo.trim()) return;
    if (!value.clienteId) return;
    if (!value.fechaInicio.trim()) return;
    if (!value.fechaFin.trim()) return;

    onSave(value);
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.backdrop, { backgroundColor: "rgba(0,0,0,0.45)" }]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: "100%", alignItems: "center" }}
          >
            <View style={[styles.card, { backgroundColor: colores.fondoCard }]}> 
              <Text variant="titleMedium" style={[styles.title, { color: colores.textoPrincipal }]}> 
                {title}
              </Text>

              {!allowEdit ? (
                <Text style={[styles.readOnlyHint, { color: colores.textoTerciario }]}> 
                  Solo puedes modificar el estado del pedido.
                </Text>
              ) : null}

              <ScrollView keyboardShouldPersistTaps="handled">
                <Text style={[styles.label, { color: allowEdit ? colores.textoPrincipal : colores.textoTerciario }]}>Codigo</Text>
                <TextInput
                  mode="outlined"
                  placeholder="PED-0001"
                  value={value.codigo}
                  onChangeText={(t) => onChange({ ...value, codigo: t })}
                  style={[styles.input, { backgroundColor: colores.fondoInput }, inputDisabledStyle]}
                  outlineStyle={{ borderRadius: RADIUS }}
                  textColor={colores.textoPrincipal}
                  placeholderTextColor={colores.textoSecundario}
                  editable={allowEdit}
                  disabled={!allowEdit}
                />

                <Text style={[styles.label, { color: allowEdit ? colores.textoPrincipal : colores.textoTerciario }]}>Cliente</Text>
                <Pressable
                  onPress={() => setSelectorVisible(true)}
                  disabled={!allowEdit}
                  style={({ pressed }) => [
                    styles.selector,
                    {
                      borderColor: allowEdit ? colores.borde : colores.bordeInput,
                      backgroundColor: allowEdit ? colores.fondoInput : colores.fondoPrincipal,
                      opacity: allowEdit ? 1 : 0.6,
                    },
                    pressed && allowEdit ? styles.selectorPressed : null,
                  ]}
                >
                  <Text style={[styles.selectorText, { color: allowEdit ? colores.textoPrincipal : colores.textoTerciario }]}>
                    {clienteLabel}
                  </Text>
                </Pressable>

                <Text style={[styles.label, { color: allowEdit ? colores.textoPrincipal : colores.textoTerciario }]}>Tipo (opcional)</Text>
                <TextInput
                  mode="outlined"
                  placeholder="Alquiler / Venta"
                  value={value.tipo}
                  onChangeText={(t) => onChange({ ...value, tipo: t })}
                  style={[styles.input, { backgroundColor: colores.fondoInput }, inputDisabledStyle]}
                  outlineStyle={{ borderRadius: RADIUS }}
                  textColor={colores.textoPrincipal}
                  placeholderTextColor={colores.textoSecundario}
                  editable={allowEdit}
                  disabled={!allowEdit}
                />

                <Text style={[styles.label, { color: allowEdit ? colores.textoPrincipal : colores.textoTerciario }]}>Fecha inicio</Text>
                <TextInput
                  mode="outlined"
                  placeholder="YYYY-MM-DD"
                  value={value.fechaInicio}
                  onChangeText={(t) => onChange({ ...value, fechaInicio: t })}
                  style={[styles.input, { backgroundColor: colores.fondoInput }, inputDisabledStyle]}
                  outlineStyle={{ borderRadius: RADIUS }}
                  textColor={colores.textoPrincipal}
                  placeholderTextColor={colores.textoSecundario}
                  editable={allowEdit}
                  disabled={!allowEdit}
                />

                <Text style={[styles.label, { color: allowEdit ? colores.textoPrincipal : colores.textoTerciario }]}>Fecha fin</Text>
                <TextInput
                  mode="outlined"
                  placeholder="YYYY-MM-DD"
                  value={value.fechaFin}
                  onChangeText={(t) => onChange({ ...value, fechaFin: t })}
                  style={[styles.input, { backgroundColor: colores.fondoInput }, inputDisabledStyle]}
                  outlineStyle={{ borderRadius: RADIUS }}
                  textColor={colores.textoPrincipal}
                  placeholderTextColor={colores.textoSecundario}
                  editable={allowEdit}
                  disabled={!allowEdit}
                />

                <Text style={[styles.label, { color: colores.textoPrincipal }]}>Estado</Text>
                <View style={styles.estadoRow}>
                  {ESTADOS.map((estado) => (
                    <Button
                      key={estado}
                      mode={value.estado === estado ? "contained" : "outlined"}
                      onPress={() => onChange({ ...value, estado })}
                      disabled={!allowStatusChange}
                      style={styles.estadoButton}
                    >
                      {estado}
                    </Button>
                  ))}
                </View>

                <Text style={[styles.label, { color: allowEdit ? colores.textoPrincipal : colores.textoTerciario }]}>Notas (opcional)</Text>
                <TextInput
                  mode="outlined"
                  placeholder="Notas internas"
                  value={value.notas}
                  onChangeText={(t) => onChange({ ...value, notas: t })}
                  style={[styles.input, { backgroundColor: colores.fondoInput }, inputDisabledStyle]}
                  outlineStyle={{ borderRadius: RADIUS }}
                  textColor={colores.textoPrincipal}
                  placeholderTextColor={colores.textoSecundario}
                  editable={allowEdit}
                  disabled={!allowEdit}
                  multiline
                />
              </ScrollView>

              <View style={styles.row}>
                <Button onPress={onCancel} mode="text" disabled={saving}>
                  Cancelar
                </Button>
                <Button onPress={aceptar} mode="contained" loading={saving} disabled={saving}>
                  Guardar
                </Button>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>

      <Modal
        transparent
        animationType="fade"
        visible={selectorVisible}
        onRequestClose={() => setSelectorVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectorVisible(false)}>
          <View style={[styles.backdrop, { backgroundColor: "rgba(0,0,0,0.5)" }]}> 
            <View style={[styles.selectorCard, { backgroundColor: colores.fondoCard }]}> 
              <Text variant="titleMedium" style={[styles.title, { color: colores.textoPrincipal }]}> 
                Selecciona cliente
              </Text>
              <ScrollView style={styles.selectorList}>
                {clientes.map((cliente) => (
                  <Pressable
                    key={cliente.id}
                    onPress={() => {
                      onChange({ ...value, clienteId: cliente.id });
                      setSelectorVisible(false);
                    }}
                    style={({ pressed }) => [
                      styles.selectorItem,
                      pressed && styles.selectorPressed,
                    ]}
                  >
                    <Text style={[styles.selectorText, { color: colores.textoPrincipal }]}> 
                      {cliente.nombre}
                    </Text>
                    <Text style={[styles.selectorSubtext, { color: colores.textoSecundario }]}> 
                      {cliente.email}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Modal>
  );
}
