import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button } from 'react-native';
import GoBackAppBar from '../components/GoBackAppBar';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import DefaultAppBar from "../components/DefaultAppBar";

const UpdateProfile = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [preferences, setPreferences] = useState('');
  const [favorites, setFavorites] = useState('');
  const [allergies, setAllergies] = useState('');
  const [privateDetails, setPrivateDetails] = useState('');
  const [publicDetails, setPublicDetails] = useState('');
  const [premium, setPremium] = useState('');

  const auth = getAuth();
  const database = getDatabase();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const userProfileRef = ref(database, 'users/' + user.uid);

      // Ladataan käyttäjän tiedot tietokannasta
      onValue(userProfileRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUsername(data.username || '');
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setBirthDate(data.birthDate || '');
          setAddress(data.address || '');
          setPreferences(data.preferences || '');
          setFavorites(data.favorites || '');
          setAllergies(data.allergies || '');
          setPrivateDetails(data.privateDetails || '');
          setPublicDetails(data.publicDetails || '');
          setPremium(data.premium || '');
        }
      });
    }
  }, [user, database]);

  const handleUpdateProfile = () => {
    
    if (!username || !firstName || !lastName || !birthDate || !address || !preferences || !favorites || !allergies) {
      alert('Please fill in all required fields.');
      return;
    }

    if (user) {
      const userProfileRef = ref(database, 'users/' + user.uid);
        set(userProfileRef, {
          username,
          firstName,
          lastName,
          birthDate,
          address,
          preferences,
          favorites,
          allergies,
          privateDetails,
          publicDetails,
          premium,
        }).then(() => {
          // Kun päivitys on valmis, navigoi Welcome-näyttöön
          navigation.navigate('Welcome');
        }).catch((error) => {
          console.error('Profile update failed:', error);
        });
      } else {
        console.error('User not signed in');
      }
  };

  return (
    <View style={styles.container}>
      <GoBackAppBar />
      <TextInput placeholder="Username" onChangeText={setUsername} value={username} />
      <TextInput placeholder="First Name" onChangeText={setFirstName} value={firstName} />
      <TextInput placeholder="Last Name" onChangeText={setLastName} value={lastName} />
      <TextInput placeholder="Birth Date" onChangeText={setBirthDate} value={birthDate} />
      <TextInput placeholder="Address" onChangeText={setAddress} value={address} />
      <TextInput placeholder="Preferences" onChangeText={setPreferences} value={preferences} />
      <TextInput placeholder="Favorites" onChangeText={setFavorites} value={favorites} />
      <TextInput placeholder="Allergies" onChangeText={setAllergies} value={allergies} />
      <TextInput placeholder="Private Details" onChangeText={setPrivateDetails} value={privateDetails} />
      <TextInput placeholder="Public Details" onChangeText={setPublicDetails} value={publicDetails} />
      <TextInput placeholder="Premium" onChangeText={setPremium} value={premium} />
      <Button title="Update Profile" onPress={handleUpdateProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  add: {
    width: 350,
    height: 100,
    alignSelf: "center",
    marginTop: 16,
    marginBottom: 16,
  },
   container: {
    backgroundColor: "white",
  },
  welcomeText: {
    marginLeft: 8,
    marginTop: 20,
    marginBottom: 16,
    fontSize: 16,
    textAlign: "center",
  },
  infoText: {
    marginTop: 8,
    marginBottom: 26,
    fontSize: 20,
    color: "#8B8B8B",
    textAlign: "center",
  },
  textFavourites: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 20,
    color: "#8B8B8B",
    textAlign: "center",
  },
});

export default UpdateProfile;