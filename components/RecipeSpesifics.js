import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDIsbSss0td8yHf_-JiKBf75--RQFwI-pM',
  authDomain: 'reseptisovellustwitter.firebaseapp.com',
  databaseURL: 'https://reseptisovellustwitter-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'reseptisovellustwitter',
  storageBucket: 'reseptisovellustwitter.appspot.com',
  messagingSenderId: '773290742758',
  appId: '1:773290742758:web:156b14135fcdcfc9f73c27'
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

export default function App() {
  const [resepti, setResepti] = useState(null);

  useEffect(() => {
    // Voit käyttää useEffectia alustamaan Firebase-tietokantayhteys
    return () => {
      // Tässä voit sulkea yhteyden tarvittaessa
    };
  }, []);

  const tarkasteleReseptia = async () => {
    try {
      const reseptiRef = db.collection('reseptit').doc('esimerkki');
      const reseptiData = await reseptiRef.get();

      if (reseptiData.exists) {
        const data = reseptiData.data();

        if (data.premium) {
          Alert.alert("Huomio", "Sinun täytyy päivittää premium-versioon nähdäksesi tämän reseptin yksityiskohdat.");
        } else {
          setResepti(data);
        }
      } else {
        Alert.alert("Virhe", "Reseptiä ei löytynyt.");
      }
    } catch (error) {
      console.error('Tietojen hakeminen epäonnistui', error);
      Alert.alert("Virhe", "Tietojen hakeminen epäonnistui. Yritä uudelleen myöhemmin.");
    }
  };

  const renderResepti = () => {
    return (
      <View>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{resepti.nimi}</Text>
        <Text style={{ fontSize: 16, marginVertical: 10 }}>Ainekset:</Text>
        <ul>
          {resepti.ainekset.map((ainesosa, index) => (
            <Text key={index}>- {ainesosa}</Text>
          ))}
        </ul>
        <Text style={{ fontSize: 16, marginVertical: 10 }}>Ohjeet:</Text>
        <Text>{resepti.ohjeet}</Text>
      </View>
    );
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Reseptin tiedot</Text>
      {resepti ? (
        renderResepti()
      ) : (
        <Button title="Tarkastele reseptiä" onPress={tarkasteleReseptia} />
      )}
    </View>
  );
}
