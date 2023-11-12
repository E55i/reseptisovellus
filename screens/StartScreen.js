import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Alert } from 'react-native';
import { auth, signInWithEmailAndPassword, signInWithGoogle } from './FirebaseConfig'; // Oletan, että olet lisännyt signInWithGoogle-funktion konfiguraatioosi
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigation.navigate('Welcome'); // Kirjautuminen onnistui
      })
      .catch(error => {
        Alert.alert('Kirjautumisvirhe', error.message);
      });
  };
  /*const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // Google-kirjautuminen onnistui
        navigation.navigate('Welcome');
      }).catch((error) => {
        // Google-kirjautumisvirhe
        Alert.alert('Kirjautumisvirhe', error.message);
      });
  };*/

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
  // Lisää tähän muita tyylejä tarvittaessa
});

export default LoginScreen;