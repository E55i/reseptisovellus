import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity, Text, Platform, Alert } from 'react-native';
import GoBackAppBar from '../components/GoBackAppBar';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import DateTimePicker from '@react-native-community/datetimepicker'; 

const UpdateProfile = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [address, setAddress] = useState('');
  // const [preferences, setPreferences] = useState('');
  // const [favorites, setFavorites] = useState('');
  // const [allergies, setAllergies] = useState('');
  // const [privateDetails, setPrivateDetails] = useState('');
  // const [publicDetails, setPublicDetails] = useState('');
  // const [premium, setPremium] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const auth = getAuth();
  const database = getDatabase();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const userProfileRef = ref(database, 'users/' + user.uid);
      onValue(userProfileRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUsername(data.username || '');
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          const dbDate = data.birthDate ? new Date(data.birthDate) : new Date();
          setBirthDate(dbDate);
          setAddress(data.address || '');
          // setPreferences(data.preferences || '');
          // setFavorites(data.favorites || '');
          // setAllergies(data.allergies || '');
          // setPrivateDetails(data.privateDetails || '');
          // setPublicDetails(data.publicDetails || '');
          // setPremium(data.premium || '');
        }
      });
    }
  }, [user, database]);

  const validateName = (name, fieldName) => {
    if (name.length > 20) {
      Alert.alert('Virhe', `${fieldName} ei voi olla yli 20 merkkiä pitkä.`);
      return false;
    }

    if (!/^[a-zA-ZäöüÄÖÜß ]+$/.test(name)) {
      Alert.alert('Virhe', `${fieldName} voi sisältää vain kirjaimia.`);
      return false;
    }

    return true;
  };

  const handleUpdateProfile = () => {
    if (!username || !firstName || !lastName || !birthDate || !address) {
      Alert.alert('Virhe', 'Täytä kaikki pakolliset kentät.');
      return;
    }

    if (!validateName(firstName, "Etunimi") || !validateName(lastName, "Sukunimi")) {
      return;
    }

    if (user) {
      const userProfileRef = ref(database, 'users/' + user.uid);
      set(userProfileRef, {
        username,
        firstName,
        lastName,
        birthDate: birthDate.toISOString().split('T')[0],
        address,
        // preferences,
        // favorites,
        // allergies,
        // privateDetails,
        // publicDetails,
        // premium,
      })
      .then(() => {
        navigation.navigate('Welcome');
      })
      .catch((error) => {
        console.error('Profiilin päivitys epäonnistui:', error);
      });
    } else {
      console.error('Käyttäjä ei ole kirjautunut sisään');
    }
  };

  const onChangeBirthDate = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(Platform.OS === 'ios'); 
    setBirthDate(currentDate);
  };

  return (
    <View style={styles.fullScreenContainer}>
      <GoBackAppBar backgroundColor="orange" navigation={navigation} />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <TextInput 
          placeholder="Käyttäjänimi" 
          onChangeText={setUsername} 
          value={username} 
          style={styles.input}
          onFocus={() => setUsername('')}
        />
  
        <TextInput 
          placeholder="Etunimi" 
          onChangeText={setFirstName} 
          value={firstName} 
          style={styles.input}
          onFocus={() => setFirstName('')}
        />
  
        <TextInput 
          placeholder="Sukunimi" 
          onChangeText={setLastName} 
          value={lastName} 
          style={styles.input}
          onFocus={() => setLastName('')}
        />
  
        <TextInput 
          placeholder="Osoite" 
          onChangeText={setAddress} 
          value={address} 
          style={styles.input}
          onFocus={() => setAddress('')}
        />
  
        {/* Uncomment and use these fields if needed */}
        {/* <TextInput 
          placeholder="Mieltymykset" 
          onChangeText={setPreferences} 
          value={preferences} 
          style={styles.input} 
          onFocus={() => setPreferences('')} 
        /> */}
  
        {/* <TextInput 
          placeholder="Suosikit" 
          onChangeText={setFavorites} 
          value={favorites} 
          style={styles.input} 
          onFocus={() => setFavorites('')} 
        /> */}
  
        {/* <TextInput 
          placeholder="Allergiat" 
          onChangeText={setAllergies} 
          value={allergies} 
          style={styles.input} 
          onFocus={() => setAllergies('')} 
        /> */}
  
        {/* <TextInput 
          placeholder="Yksityiskohdat" 
          onChangeText={setPrivateDetails} 
          value={privateDetails} 
          style={styles.input} 
          onFocus={() => setPrivateDetails('')} 
        /> */}
  
        {/* <TextInput 
          placeholder="Julkinen Profiili" 
          onChangeText={setPublicDetails} 
          value={publicDetails} 
          style={styles.input} 
          onFocus={() => setPublicDetails('')} 
        /> */}
  
        {/* <TextInput 
          placeholder="Premium" 
          onChangeText={setPremium} 
          value={premium} 
          style={styles.input} 
          onFocus={() => setPremium('')} 
        /> */}
  
        {/* DateTimePicker Trigger Button */}
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.customButtonText}>Valitse syntymäaika</Text>
        </TouchableOpacity>
  
        {/* DateTimePicker Component */}
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={birthDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeBirthDate}
          />
        )}
  
        {/* Update Profile Button */}
        <TouchableOpacity
          style={styles.customButton}
          onPress={handleUpdateProfile}
        >
          <Text style={styles.customButtonText}>Päivitä Profiili</Text>
        </TouchableOpacity>
  
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    padding: 14,
  },
  contentContainer: {
    justifyContent: 'flex-end',
    flexGrow: 1,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 10,
  },
  datePickerContainer: {
    marginBottom: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    justifyContent: 'center',
  },
  customButton: {
    backgroundColor: 'orange',
    borderColor: 'orange',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  customButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
export default UpdateProfile;
