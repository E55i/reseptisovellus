/*import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import GoogleSignIn from 'expo-google-sign-in';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';

const GoogleLogin = ({ navigation }) => {
  const googleLogin = async () => {
    try {
      await GoogleSignIn.initAsync({
        clientId: '// Tähän Google Client ID',
        // iosClientId: 'YOUR_IOS_CLIENT_ID', // Jos käytät iOS:ää, laita tämä
      });
      const result = await GoogleSignIn.signInAsync();

      if (result.type === "success") {
        const credential = GoogleAuthProvider.credential(result.user.auth.idToken, null);
        const auth = getAuth();
        signInWithCredential(auth, credential)
          .then((result) => {
            console.log(result);
            navigation.navigate('Welcome'); // Minne haluat siirtyä kirjautumisen jälkeen
          });
      } else {
        console.log("cancelled");
      }
    } catch (e) {
      console.log("error", e);
      Alert.alert('Kirjautumisvirhe', e.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Kirjaudu sisään Google-tunnuksellasi</Text>
      <Button
        title="Kirjaudu Googlella"
        onPress={googleLogin}
      />
    </View>
  );
};

export default GoogleLogin;*/
