import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button, ScrollView } from 'react-native';
import GoBackAppBar from '../components/GoBackAppBar';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const database = getDatabase();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const userProfileRef = ref(database, 'users/' + user.uid);
      get(userProfileRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          } else {
            console.error('Käyttäjätietoja ei löydy');
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Virhe haettaessa käyttäjätietoja:', error);
          setLoading(false);
        });
    }
  }, [user]);

  const navigateToUpdateProfile = () => {
    navigation.navigate('UpdateProfile');
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Käyttäjätietoja ei löydy. Ole hyvä ja päivitä profiilisi.</Text>
        <Button title="Päivitä Profiili" onPress={navigateToUpdateProfile} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GoBackAppBar backgroundColor="orange" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {userData ? (
          <View style={styles.userData}>
            {Object.entries(userData).map(([key, value]) => {
              const fieldMappings = {
                username: 'Käyttäjänimi',
                firstName: 'Etunimi',
                lastName: 'Sukunimi',
                birthDate: 'Syntymäaika',
                address: 'Osoite',
                preferences: 'Mieltymykset',
                favorites: 'Suosikit',
                allergies: 'Allergiat',
                privateDetails: 'Yksityiskohdat',
                publicDetails: 'Julkinen Profiili',
                premium: 'Premium',
              };

              // Tarkista, onko avain kenttämappauksessa ja käytä sen mukaista nimeä
              const displayName = fieldMappings[key] || key;

              return (
                <View style={styles.dataBox} key={key}>
                  <Text style={styles.dataTitle}>{displayName}: </Text>
                  <Text style={styles.dataValue}>{value}</Text>
                </View>
              );
            })}
            <Button title="Päivitä Profiili" onPress={navigateToUpdateProfile} style={styles.updateButton} />
          </View>
        ) : (
          <Text>Käyttäjätietoja ei ole saatavilla</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1, // Lisää tämä rivi
    backgroundColor: "white",
  },
  userData: {
    padding: 10,
  },
  dataBox: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
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
  updateButton: {
    marginTop: 10,
  },
});

export default Profile;
