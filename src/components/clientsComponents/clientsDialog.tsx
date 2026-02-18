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
import { Button, TextInput, Text } from "react-native-paper";
import { Cliente } from "../../types/types";
import { useTemaStore } from "../../app/(tabs)/preferencias";
import { obtenerColores } from "../../theme";

export type ClientForm = Omit<Cliente, "id">;

type Props = {
  visible: boolean;
  title: string;
  value: ClientForm;
  onChange: (v: ClientForm) => void;
  onCancel: () => void;
  onSave: (v: ClientForm) => void;
};

const RADIUS = 16;

export default function ClienteDialog({
  visible,
  title,
  value,
  onChange,
  onCancel,
  onSave,
}: Props) {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);

  const aceptar = () => {
    if (!value.nombre.trim()) return;

    onSave(value);
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[s.backdrop, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
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
                  placeholder="Nombre"
                  value={value.nombre}
                  onChangeText={(t) => onChange({ ...value, nombre: t })}
                  style={[s.input, { backgroundColor: colores.fondoInput }]}
                  outlineStyle={{ borderRadius: RADIUS }}
                  left={<TextInput.Icon icon="account" />}
                  textColor={colores.textoPrincipal}
                  placeholderTextColor={colores.textoSecundario}
                />

                <TextInput
                  mode="outlined"
                  placeholder="NIF/CIF (opcional)"
                  value={value.nifCif}
                  onChangeText={(t) => onChange({ ...value, nifCif: t })}
                  style={[s.input, { backgroundColor: colores.fondoInput }]}
                  outlineStyle={{ borderRadius: RADIUS }}
                  left={<TextInput.Icon icon="card-account-details" />}
                  textColor={colores.textoPrincipal}
                  placeholderTextColor={colores.textoSecundario}
                />

                <TextInput
                  mode="outlined"
                  placeholder="Teléfono (opcional)"
                  value={value.telefono}
                  onChangeText={(t) => onChange({ ...value, telefono: t })}
                  style={[s.input, { backgroundColor: colores.fondoInput }]}
                  outlineStyle={{ borderRadius: RADIUS }}
                  left={<TextInput.Icon icon="phone" />}
                  keyboardType="phone-pad"
                  textColor={colores.textoPrincipal}
                  placeholderTextColor={colores.textoSecundario}
                />

                <TextInput
                  mode="outlined"
                  placeholder="Email"
                  value={value.email}
                  onChangeText={(t) => onChange({ ...value, email: t })}
                  style={[s.input, { backgroundColor: colores.fondoInput }]}
                  outlineStyle={{ borderRadius: RADIUS }}
                  left={<TextInput.Icon icon="email" />}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textColor={colores.textoPrincipal}
                  placeholderTextColor={colores.textoSecundario}
                />
              </ScrollView>

              <View style={s.row}>
                <Button onPress={onCancel} mode="text">
                  Cancelar
                </Button>
                <Button onPress={aceptar} mode="contained">
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
    borderRadius: 20,
    padding: 16,
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
});
