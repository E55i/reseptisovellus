import { StyleSheet } from 'react-native'
import React from 'react'
import { AppBar, HStack, IconButton } from '@react-native-material/core'
import { FontAwesome, Ionicons } from '@expo/vector-icons'

export default function GoBackAppBar({backgroundColor, navigation}) {
    return (
        <AppBar
       backgroundColor={backgroundColor}
       leading={props=>(
        <HStack
        >
          <IconButton
          style={styles.addIcon}
          icon={<Ionicons name="arrow-back" size={28} color="white" />}
          onPress={()=> {navigation.goBack()}}
          {...props}
          />
          <IconButton
          style={styles.searchIcon}
          icon={<Ionicons name="search-outline" size={28} color="white" />}
          onPress={()=>{navigation.navigate('SearchRecipe')}}
          {...props}
          />
        </HStack>
       )}
       trailing={props=>(
        <IconButton
        style={styles.profileIcon}
        icon={<FontAwesome name="user-circle-o" size={28} color="white" />}
        onPress={()=>{navigation.navigate('Profile')}}
        {...props}
        />
       )}
       />
      )
    }
    const styles = StyleSheet.create({
      appbar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',    
      },
      addIcon: {
        marginLeft: 10,
      },
      searchIcon: {
        marginLeft: 95,
      },
      profileIcon: {
        marginRight: 10,
      },
    });
    