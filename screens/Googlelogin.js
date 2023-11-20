import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';

// Google Sign-In konfiguraatio
GoogleSignin.configure({
  webClientId: '773290742758-3jgmb4ma29gr8pglj2sinml2rrfb60o6.apps.googleusercontent.com',
  offlineAccess: true,
  scopes: ['profile', 'email'],
});

const GoogleLogin = ({ navigation }) => {
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const credential = GoogleAuthProvider.credential(userInfo.idToken);
      const auth = getAuth();
      await signInWithCredential(auth, credential);
      // Google-kirjautuminen onnistui
      navigation.navigate('Welcome');
    } catch (error) {
      // Google-kirjautumisvirhe
      Alert.alert('Kirjautumisvirhe', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Kirjaudu sisään Google-tunnuksellasi</Text>
      <Button
        title="Kirjaudu Googlella"
        onPress={handleGoogleLogin}
      />
    </View>
  );
};

export default GoogleLogin;
