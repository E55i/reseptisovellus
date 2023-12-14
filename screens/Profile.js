import React, { useState, useEffect, useRef } from 'react';
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
import { Colors } from "../styles/Colors";
import { SimpleLineIcons } from "@expo/vector-icons";

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremiumVisible, setIsPremiumVisible] = useState(true);

  const route = useRoute();
  const auth = getAuth();
  const database = getDatabase();
  const user = auth.currentUser;

  const scrollViewRef = useRef(null);

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

  const renderUserData = () => {
    const fieldOrder = ['bio', 'username', 'firstName', 'lastName', 'address', 'birthDate'];

    return fieldOrder.map((key) => {
      const originalValue = userData[key];
      let value = originalValue;

      if (key === 'birthDate' && value) {
        const date = new Date(value);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
        value = formattedDate;
      }

      const fieldMappings = {
        bio: 'Bio',
        username: 'Käyttäjänimi',
        firstName: 'Etunimi',
        lastName: 'Sukunimi',
        birthDate: 'Syntymäaika',
        address: 'Osoite',
        profilePicture: 'Profiilikuva',
      };

      const boxStyle = {
        ...styles.dataBox,
        ...(fieldMappings[key] === 'Bio' && { borderWidth: 2, borderColor: Colors.secondary, height: 130, marginTop: -10 }),
      };

      if (fieldMappings[key] && originalValue) {
        return (
          <View style={boxStyle} key={key}>
            <Text style={styles.dataTitle}>{fieldMappings[key]}: </Text>
            {key === 'bio' ? (
              <Text style={styles.dataValue} numberOfLines={4}>{value}</Text>
            ) : (
              <Text style={styles.dataValue}>{value}</Text>
            )}
          </View>
        );
      }
      return null;
    });
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    const threshold = 100; // Adjust this value based on when you want the premium icon to hide

    setIsPremiumVisible(scrollPosition < threshold);
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <GoBackAppBar backgroundColor={Colors.primary} navigation={navigation} />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        onScroll={handleScroll}
        ref={scrollViewRef}
        scrollEventThrottle={16} // Adjust the throttle value as needed
      >
        {/* Check if user is premium and render diamond icon */}
        {isPremiumVisible && userData?.premium === "1" && (
          <View style={styles.premiumIconContainer}>
            <SimpleLineIcons name="diamond" size={40} color={Colors.diamond} />
          </View>
        )}
        {userData?.profilePicture ? (
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: userData.profilePicture }} style={styles.profileImage} />
          </View>
        ) : (
          <View style={styles.profileImageContainer}>
            {/* Display a placeholder image or any other content */}
            <Image source={require('../assets/placeholder-image.png')} style={styles.profileImage} />
          </View>
        )}
        {userData ? (
          <View style={styles.userData}>
            {renderUserData()}
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Text>Käyttäjätietoja ei ole saatavilla</Text>
          </View>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.customButton, { backgroundColor: Colors.primary }]} onPress={navigateToUpdateProfile}>
            <Text style={styles.buttonText}>Muokkaa tietoja</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.customButton, { backgroundColor: Colors.primary }]} onPress={confirmLogout}>
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
    marginTop: 10,
    marginBottom: 20,
  },
  profileImage: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderColor: Colors.secondary,
    borderWidth: 2,
  },
  userData: {
    padding: 10,
  },
  noDataContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dataBox: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    borderColor: Colors.secondary,
    borderWidth: 2,
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
    borderRadius: 10,
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  premiumIconContainer: {
    position: 'absolute',
    top: '1%',
    left: '1%',
    zIndex: 1,
  },
});

export default Profile;