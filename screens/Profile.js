import React from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import GoBackAppBar from '../components/GoBackAppBar';

const dummyProfileData = [
    { id: '1', name: 'Pasta', rating: 5 },
    { id: '2', name: 'Pizza', rating: 4 },
    // ... more data
  ];

export default function Profile({ ...props }) {
    return (
        <View>
          <GoBackAppBar { ...props }/>
          <Text>User's Profile</Text>
          <Text>Email: user@example.com</Text>
          <Text>My Recipes:</Text>
          <FlatList
            data={dummyProfileData}
            renderItem={({ item }) => (
              <View>
                <Text>{item.name} (Rating: {item.rating})</Text>
                <Button title="View" onPress={() => { /* Navigate to recipe details */ }} />
              </View>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      )
}

/* Luonnosta kuinka profiili yhdistetään tietokantaan

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database';

const auth = getAuth();
const database = getDatabase();

// Kun käyttäjä kirjautuu sisään tai rekisteröityy
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    // Tallenna tai päivitä käyttäjän tiedot
    const userProfileRef = ref(database, 'users/' + uid);
    set(userProfileRef, {
      // ...käyttäjän tiedot, esim. nimi, sähköposti jne.
    });
  }
});

// Päivitä käyttäjän profiilitiedot
const updateUserProfile = (userData) => {
  const user = auth.currentUser;
  if (user) {
    const userProfileRef = ref(database, 'users/' + user.uid);
    set(userProfileRef, userData);
  }
};

// Hae käyttäjän profiilitiedot
const getUserProfile = async (userId) => {
  const userProfileRef = ref(database, 'users/' + userId);
  const snapshot = await get(userProfileRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    // Käyttäjän tietoja ei löydy
    return null;
  }
};
*/
