import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import GoBackAppBar from '../components/GoBackAppBar';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useRoute } from '@react-navigation/native';

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const route = useRoute();
  const auth = getAuth();
  const database = getDatabase();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const userProfileRef = ref(database, 'users/' + user.uid);
      const unsubscribe = onValue(userProfileRef, (snapshot) => {
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        } else {
          console.error('Käyttäjätietoja ei löydy');
        }
        setLoading(false);
      }, (error) => {
        console.error('Virhe haettaessa käyttäjätietoja:', error);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user, database]);

  const navigateToUpdateProfile = () => {
    navigation.navigate('UpdateProfile');
  };

  const confirmLogout = () => {
    Alert.alert(
      'Kirjaudu ulos',
      'Oletko varma että haluat kirjautua ulos?',
      [
        {
          text: 'Ei',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Kyllä',
          onPress: () => handleLogout(),
        },
      ]
    );
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  const renderUserData = (key, value) => {
    const fieldMappings = {
      username: 'Käyttäjänimi',
      firstName: 'Etunimi',
      lastName: 'Sukunimi',
      birthDate: 'Syntymäaika',
      address: 'Osoite',
    };

    if (fieldMappings[key] && value) {
      return (
        <View style={styles.dataBox} key={key}>
          <Text style={styles.dataTitle}>{fieldMappings[key]}: </Text>
          <Text style={styles.dataValue}>{value}</Text>
        </View>
      );
    }
    return null;
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <GoBackAppBar backgroundColor="orange" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileImageContainer}>
          {userData?.profilePicture ? (
            <Image source={{ uri: userData.profilePicture }} style={styles.profileImage} />
          ) : null}
        </View>
        {userData ? (
          <View style={styles.userData}>
            {Object.entries(userData).map(([key, value]) => renderUserData(key, value))}
          </View>
        ) : (
          <Text>Käyttäjätietoja ei ole saatavilla</Text>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.customButton} onPress={navigateToUpdateProfile}>
            <Text style={styles.buttonText}>Muokkaa tietoja</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.customButton} onPress={confirmLogout}>
            <Text style={styles.buttonText}>Kirjaudu ulos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 275,
    height: 275,
    borderRadius: 137.5,
  },
  userData: {
    padding: 10,
  },
  dataBox: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    borderColor: 'green',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  dataTitle: {
    fontWeight: 'bold',
    color: '#333333',
  },
  dataValue: {
    color: '#555555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
  customButton: {
    borderWidth: 1,
    borderColor: 'orange',
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'orange',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default Profile;
