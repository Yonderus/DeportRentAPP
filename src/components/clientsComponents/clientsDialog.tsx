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
import { Client } from "../../data/clients";

export type ClientForm = Omit<Client, "id">;

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
  const aceptar = () => {
    if (!value.name.trim()) return;
    if (!value.surname.trim()) return;
    if (!value.phone.trim()) return;

    onSave({ ...value, pedidos: value.pedidos ?? [] });
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={s.backdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: "100%" }}
          >
            <View style={s.card}>
              <Text variant="titleMedium" style={s.title}>
                {title}
              </Text>

              <ScrollView keyboardShouldPersistTaps="handled">
                <TextInput
                  mode="outlined"
                  placeholder="Nombre"
                  value={value.name}
                  onChangeText={(t) => onChange({ ...value, name: t })}
                  style={s.input}
                  outlineStyle={{ borderRadius: RADIUS }}
                  left={<TextInput.Icon icon="account" />}
                />

                <TextInput
                  mode="outlined"
                  placeholder="Apellidos"
                  value={value.surname}
                  onChangeText={(t) => onChange({ ...value, surname: t })}
                  style={s.input}
                  outlineStyle={{ borderRadius: RADIUS }}
                  left={<TextInput.Icon icon="account-details" />}
                />

                <TextInput
                  mode="outlined"
                  placeholder="Teléfono"
                  value={value.phone}
                  onChangeText={(t) => onChange({ ...value, phone: t })}
                  style={s.input}
                  outlineStyle={{ borderRadius: RADIUS }}
                  left={<TextInput.Icon icon="phone" />}
                  keyboardType="phone-pad"
                />

                <TextInput
                  mode="outlined"
                  placeholder="Email"
                  value={value.email}
                  onChangeText={(t) => onChange({ ...value, email: t })}
                  style={s.input}
                  outlineStyle={{ borderRadius: RADIUS }}
                  left={<TextInput.Icon icon="email" />}
                  keyboardType="email-address"
                  autoCapitalize="none"
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
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
  },
  title: {
    fontWeight: "800",
    marginBottom: 10,
  },
  input: {
    marginTop: 10,
    backgroundColor: "#f5f6fa",
  },
  row: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
