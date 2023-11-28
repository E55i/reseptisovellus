import React from 'react';
import { StyleSheet } from 'react-native';
import { AppBar, HStack, IconButton } from '@react-native-material/core';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

export default function GoBackAppBar({ backgroundColor, navigation }) {
  return (
    <AppBar
      backgroundColor={backgroundColor}
      leading={props => (
        <IconButton
          icon={<Ionicons name="arrow-back" size={28} color="white" />}
          onPress={() => navigation.goBack()}
          {...props}
        />
      )}
      title={props => (
        <HStack style={styles.centerContainer}>
          <IconButton
            icon={<Ionicons name="search-outline" size={28} color="white" />}
            onPress={() => navigation.navigate('SearchRecipe')}
            {...props}
          />
        </HStack>
      )}
      trailing={props=>(
        <IconButton
          icon={<FontAwesome name="user-circle-o" size={28} color="white" />}
        onPress={()=> navigation.navigate('Profile')}
          {...props}
        />
      )}
    />
  );
}
const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
