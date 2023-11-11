import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import DefaultAppBar from '../components/DefaultAppBar'
import Categories from '../components/Categories'
import RecipeCard from '../components/RecipeCard'

//Hae käyttäjän nimi tietokannasta
//Hae suosituimmat reseptit

export default function Welcome({ ...props }) {
  return (
    <View style={styles.container}>
      <DefaultAppBar {...props}/>
      <Text style={styles.welcomeText}>Tervetuloa Essi</Text>
      <Text style={styles.infoText}>Mitä haluaisit kokata tänään?</Text>
      <Categories/>
      <Text>Suosituimmat reseptit</Text>
      <Text>RecipeCard</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  welcomeText:{
    marginLeft: 8,
    marginTop: 8,
    marginBottom: 8,
    fontSize: 16,
  },
  infoText:{
    marginLeft: 8,
    marginTop: 8,
    marginBottom: 8,
    fontSize: 20,
    color: 'gray'
  }
})