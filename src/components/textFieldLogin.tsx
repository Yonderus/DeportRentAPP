import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";
import { useTemaStore } from "../app/(tabs)/preferencias";
import { obtenerColores } from "../theme";

interface Props {
  placeholder?: string;
  secure?: boolean;
  icon?: React.ReactNode;
}

const TextFieldLogin: React.FC<Props> = ({ 
  placeholder = "", 
  secure = false,
  icon
}) => {
  const [value, setValue] = useState("");
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);

  return (
      <TextInput
        mode="outlined"
        placeholder={placeholder}
        secureTextEntry={secure}
        value={value}
        onChangeText={setValue}
        left={icon ? <TextInput.Icon icon={() => icon} /> : undefined}
        style={{ backgroundColor: colores.fondoInput }}
        outlineStyle={{ borderRadius: 10 }}
        textColor={colores.textoPrincipal}
        placeholderTextColor={colores.textoSecundario}
      />
  );
};

export default TextFieldLogin;
