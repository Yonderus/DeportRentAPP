import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";



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

  return (
      <TextInput
        mode="outlined"
        placeholder={placeholder}
        secureTextEntry={secure}
        value={value}
        onChangeText={setValue}
        left={icon ? <TextInput.Icon icon={() => icon} /> : undefined}
        style={{ backgroundColor: "whitesmoke" }}
        outlineStyle={{ borderRadius: 10 }}
      />
  );
};

export default TextFieldLogin;
