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
        <View style={styles.backdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: "100%" }}
          >
            <View style={styles.card}>
              <Text variant="titleMedium" style={styles.title}>
                {title}
              </Text>

              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 8 }}
              >
                <TextInput
                  mode="outlined"
                  label="Nombre"
                  value={value.name}
                  onChangeText={(t) => onChange({ ...value, name: t })}
                  style={styles.input}
                />

                <TextInput
                  mode="outlined"
                  label="Apellidos"
                  value={value.surname}
                  onChangeText={(t) => onChange({ ...value, surname: t })}
                  style={styles.input}
                />

                <TextInput
                  mode="outlined"
                  label="Teléfono"
                  value={value.phone}
                  onChangeText={(t) => onChange({ ...value, phone: t })}
                  style={styles.input}
                />

                <TextInput
                  mode="outlined"
                  label="Email"
                  value={value.email}
                  onChangeText={(t) => onChange({ ...value, email: t })}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                />
              </ScrollView>

              <View style={styles.row}>
                <Button onPress={onCancel} mode="text">
                  Cancelar
                </Button>
                <Button onPress={aceptar} mode="contained">
                  Aceptar
                </Button>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxHeight: "100%",
    backgroundColor: "white",
    borderRadius: 16,
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
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
