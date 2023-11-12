/*import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';

GoogleSignin.configure({
  // ...Google-konfiguraatioasetukset
});

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
*/