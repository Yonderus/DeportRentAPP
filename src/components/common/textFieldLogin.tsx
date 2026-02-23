import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";
import { useTemaStore } from "../app/(tabs)/preferencias";
import { obtenerColores } from "../theme";

interface Props {
  placeholder?: string;
  secure?: boolean;
  icon?: React.ReactNode;
  value?: string;
  onChangeText?: (text: string) => void;
}

const TextFieldLogin: React.FC<Props> = ({ 
  placeholder = "", 
  secure = false,
  icon,
  value: controlledValue,
  onChangeText
}) => {
  const [internalValue, setInternalValue] = useState("");
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const handleChange = onChangeText || setInternalValue;

  return (
      <TextInput
        mode="outlined"
        placeholder={placeholder}
        secureTextEntry={secure}
        value={value}
        onChangeText={handleChange}
        left={icon ? <TextInput.Icon icon={() => icon} /> : undefined}
        style={{ backgroundColor: colores.fondoInput }}
        outlineStyle={{ borderRadius: 10 }}
        textColor={colores.textoPrincipal}
        placeholderTextColor={colores.textoSecundario}
      />
  );
};

export default TextFieldLogin;
