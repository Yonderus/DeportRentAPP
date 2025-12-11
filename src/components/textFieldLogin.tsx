import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

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
    <View style={styles.container}>

      {/*Lo del icono me ha ayudado la IA*/}
      {icon && <View style={styles.icon}>{icon}</View>}

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        secureTextEntry={secure}
        value={value}
        onChangeText={setValue}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",          
    alignItems: "center",          
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "silver",
    backgroundColor: "whitesmoke",
    width: "100%",
    height: 45,
    paddingHorizontal: 10,
    marginVertical: 12,
  },

  icon: {
    marginRight: 8, 
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#111",
  },
});

export default TextFieldLogin;
