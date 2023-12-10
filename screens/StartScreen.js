import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Alert } from 'react-native';
import { auth, signInWithEmailAndPassword } from '../components/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        <Button title="Kirjaudu sisään" onPress={handleLogin} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Ei tiliä? Luo tili" onPress={() => navigation.navigate('CreateUser')} />
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
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 10, // Lisää marginaali jokaisen View:n alapuolelle
  },

});

export default LoginScreen;