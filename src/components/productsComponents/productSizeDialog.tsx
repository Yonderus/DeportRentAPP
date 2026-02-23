import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button, TextInput, Text, Switch } from "react-native-paper";
import { useTemaStore } from "../../app/(tabs)/preferencias";
import { obtenerColores } from "../../theme";

export type SizeForm = {
  codigoTalla: string;
  descripcion: string;
  activo: boolean;
};

type Props = {
  visible: boolean;
  title: string;
  value: SizeForm;
  onChange: (v: SizeForm) => void;
  onCancel: () => void;
  onSave: (v: SizeForm) => void;
  saving?: boolean;
};

const RADIUS = 14;

export default function ProductSizeDialog({
  visible,
  title,
  value,
  onChange,
  onCancel,
  onSave,
  saving = false,
}: Props) {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);

  const aceptar = () => {
    if (saving) return;
    if (!value.codigoTalla.trim()) return;

    onSave(value);
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[s.backdrop, { backgroundColor: "rgba(0,0,0,0.4)" }]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: "100%" }}
          >
            <View style={[s.card, { backgroundColor: colores.fondoCard }]}> 
              <Text variant="titleMedium" style={[s.title, { color: colores.textoPrincipal }]}>
                {title}
              </Text>

              <ScrollView keyboardShouldPersistTaps="handled">
                <TextInput
                  mode="outlined"
                  placeholder="Codigo talla"
                  value={value.codigoTalla}
                  onChangeText={(t) => onChange({ ...value, codigoTalla: t })}
                  style={[s.input, { backgroundColor: colores.fondoInput }]}
                  outlineStyle={{ borderRadius: RADIUS }}
                  textColor={colores.textoPrincipal}
                  placeholderTextColor={colores.textoSecundario}
                />

                <TextInput
                  mode="outlined"
                  placeholder="Descripcion (opcional)"
                  value={value.descripcion}
                  onChangeText={(t) => onChange({ ...value, descripcion: t })}
                  style={[s.input, { backgroundColor: colores.fondoInput }]}
                  outlineStyle={{ borderRadius: RADIUS }}
                  textColor={colores.textoPrincipal}
                  placeholderTextColor={colores.textoSecundario}
                />

                <View style={s.switchRow}>
                  <Text style={[s.switchLabel, { color: colores.textoPrincipal }]}>Activo</Text>
                  <Switch
                    value={value.activo}
                    onValueChange={(v) => onChange({ ...value, activo: v })}
                    color={colores.btnPrimario}
                  />
                </View>
              </ScrollView>

              <View style={s.row}>
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
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 14,
  },
  title: {
    fontWeight: "800",
    marginBottom: 10,
  },
  input: {
    marginTop: 10,
  },
  row: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
});
