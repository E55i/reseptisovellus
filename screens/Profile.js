import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button, ScrollView } from 'react-native';
import GoBackAppBar from '../components/GoBackAppBar';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';


const Profile = ({navigation}) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const database = getDatabase();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const userProfileRef = ref(database, 'users/' + user.uid);
      get(userProfileRef).then((snapshot) => {
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        } else {
          console.error('User data not found');
        }
        setLoading(false);
      }).catch((error) => {
        console.error('Error fetching user data:', error);
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
        <Text>No user data found. Please update your profile.</Text>
        <Button title="Update Profile" onPress={navigateToUpdateProfile} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <GoBackAppBar />
      {userData ? (
        <View style={styles.userData}>
          {Object.entries(userData).map(([key, value]) => (
            <View style={styles.dataBox} key={key}>
              <Text style={styles.dataTitle}>{key}: </Text>
              <Text style={styles.dataValue}>{value}</Text>
            </View>
          ))}
          <Button title="Update Profile" onPress={navigateToUpdateProfile} style={styles.updateButton} />
        </View>
      ) : (
        <Text>User data not available</Text>
      )}
      </ScrollView>
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
  },userData: {
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



