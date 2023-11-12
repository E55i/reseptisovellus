import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

const StartScreen = ({ navigation }) => {
  const [showGreeting, setShowGreeting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (showGreeting) {
        setShowGreeting(false);
      }
    }, 5000); // Siirry kirjautumisvalikkoon 5 sekunnin kuluttua

    return () => clearTimeout(timer);
  }, [showGreeting]);

  const onSwipeAway = () => {
    setShowGreeting(false);
  };

  return (
    <GestureHandlerRootView style={styles.rootView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showGreeting}
        onRequestClose={() => setShowGreeting(false)}
      >
        <View style={styles.modalContainer}>
          <Swipeable onSwipeableRightOpen={onSwipeAway}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Tervetuloa!</Text>
            </View>
          </Swipeable>
        </View>
      </Modal>

      {!showGreeting && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('CreateUser')}>
            <Text style={styles.buttonText}>Luo tili</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('StartScreen')}>
            <Text style={styles.buttonText}>Kirjaudu sisään</Text>
          </TouchableOpacity>
        </View>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center', // Varmistetaan, että teksti on keskitetty
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  optionButton: {
    padding: 15,
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#007bff',
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default StartScreen;
