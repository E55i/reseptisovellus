import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

export default function Categories() {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.text}>Herkut</Text>
            </TouchableOpacity>            
            <TouchableOpacity>
                <Text style={styles.text}>Välipalat</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
      },
      button:{
        backgroundColor:'white',
        elevation: 7,
        shadowColor: '#000000',
        overflow: 'hidden',
        borderRadius:10,
      },
      text: {
        paddingLeft: 10,
        paddingRight:10,
        paddingTop: 8,
        paddingBottom: 8,
        borderWidth: 2,
        borderColor: '#47A73E',
        borderRadius: 10,
        //Shadow properties for 
        //shadowColor: '#000',
        //Shadow properties for iOS
        //shadowOffset: { width: 0, height: 2 },
        //shadowOpacity: 0.2,
        //shadowRadius: 2,
      }
})