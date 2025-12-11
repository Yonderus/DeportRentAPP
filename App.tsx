import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import TextFieldLogin from './src/components/textFieldLogin';
import LoginScreen from './src/screens/loginPage';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { PaperProvider } from 'react-native-paper';
import { config } from '@gluestack-ui/config';

export default function App() {
  return (
   <GluestackUIProvider config={config}>
      <PaperProvider>
        <View style={styles.container}>
          <ScrollView>
            <LoginScreen />
          </ScrollView>
        </View>
      </PaperProvider>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'darkgrey',
    alignItems: 'center',
    justifyContent: 'center',
  },

});
