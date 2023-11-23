import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, ScrollView } from 'react-native';
import GoBackAppBar from '../components/GoBackAppBar';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import DefaultAppBar from "../components/DefaultAppBar";

const UpdateProfile = ({ navigation }) => {
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
      alert('Täytä kaikki pakolliset kentät.');
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
      })
        .then(() => {
          // Kun päivitys on valmis, navigoi Tervetuloa-näyttöön
          navigation.navigate('Welcome');
        })
        .catch((error) => {
          console.error('Profiilin päivitys epäonnistui:', error);
        });
    } else {
      console.error('Käyttäjä ei ole kirjautunut sisään');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <GoBackAppBar backgroundColor="orange" navigation={navigation} />
      <TextInput placeholder="Käyttäjänimi" onChangeText={setUsername} value={username} style={styles.input} />
      <TextInput placeholder="Etunimi" onChangeText={setFirstName} value={firstName} style={styles.input} />
      <TextInput placeholder="Sukunimi" onChangeText={setLastName} value={lastName} style={styles.input} />
      <TextInput placeholder="Syntymäaika" onChangeText={setBirthDate} value={birthDate} style={styles.input} />
      <TextInput placeholder="Osoite" onChangeText={setAddress} value={address} style={styles.input} />
      <TextInput placeholder="Mieltymykset" onChangeText={setPreferences} value={preferences} style={styles.input} />
      <TextInput placeholder="Suosikit" onChangeText={setFavorites} value={favorites} style={styles.input} />
      <TextInput placeholder="Allergiat" onChangeText={setAllergies} value={allergies} style={styles.input} />
      <TextInput placeholder="Yksityiskohdat" onChangeText={setPrivateDetails} value={privateDetails} style={styles.input} />
      <TextInput placeholder="Julkinen Profiili" onChangeText={setPublicDetails} value={publicDetails} style={styles.input} />
      <TextInput placeholder="Premium" onChangeText={setPremium} value={premium} style={styles.input} />
      <Button title="Päivitä Profiili" onPress={handleUpdateProfile} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  input: {
    marginBottom: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
});

export default UpdateProfile;
