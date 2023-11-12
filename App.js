import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import Login from './screens/Login'
import CreateUser from './screens/CreateUser';
import Profile from './screens/Profile';
import AddRecipe from './screens/AddRecipe';
import RecipeDetails from './screens/RecipeDetails';
import SearchRecipe from './screens/SearchRecipe';
import Welcome from './screens/Welcome';
import StartScreen from './screens/StartScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Constants from 'expo-constants';

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login">
            {(props) =>
              <Login
                {...props}
              />
            }
          </Stack.Screen>
<<<<<<< Updated upstream
=======
          <Stack.Screen name="StartScreen" component={StartScreen} />
>>>>>>> Stashed changes
          <Stack.Screen name="CreateUser" component={CreateUser} />
          <Stack.Screen name="Welcome">
            {(props) =>
              <Welcome
                backgroundColor='#FF9C00'
                {...props}
              />
            }
          </Stack.Screen>
          <Stack.Screen name="AddRecipe">
            {(props) =>
              <AddRecipe
                backgroundColor='#FF9C00'
                {...props}
              />
            }
          </Stack.Screen>
          <Stack.Screen name="SearchRecipe">
            {(props) =>
              <SearchRecipe
                backgroundColor='#FF9C00'
                {...props}
              />
            }
          </Stack.Screen>
          <Stack.Screen name="RecipeDetails">
            {(props) =>
              <RecipeDetails
                backgroundColor='#FF9C00'
                {...props}
              />
            }
          </Stack.Screen>
          <Stack.Screen name="Profile">
            {(props) =>
              <Profile
                backgroundColor='#FF9C00'
                {...props}
              />
            }
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
    flex: 1,
  },
});
