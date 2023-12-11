import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Alert } from 'react-native';
import { auth, signInWithEmailAndPassword } from '../components/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from "../styles/Colors";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  const checkIfLoggedIn = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      // Tarkista Firebase Authenticationin kautta, onko token yhä voimassa
      auth.onAuthStateChanged(user => {
        if (user) {
          navigation.replace('Welcome'); // Käyttäjä on kirjautunut sisään
        }
      });
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      await AsyncStorage.setItem('userToken', token); // Tallenna token
      navigation.replace('Welcome'); // Kirjautuminen onnistui
    } catch (error) {
      Alert.alert('Kirjautumisvirhe', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Sähköposti"
        value={email}
        onChangeText={text => setEmail(text)}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Salasana"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
        autoCapitalize="none"
      />
      <View style={styles.buttonContainer}>
        <Button title="Kirjaudu sisään" onPress={handleLogin} color="#FF9C00" />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Ei tiliä? Luo tili" onPress={() => navigation.navigate('AppInfo')} color="#FF9C00" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: Colors.primary,
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  buttonContainer: {
  backgroundColor: "#FF9C00",
  borderRadius: 50, // Set the desired border radius here
  overflow: "hidden", // Ensure that the button container clips its contents
  marginBottom: 10,
  },

});

export default LoginScreen;