import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../app/HomeScreen';
import UserForm from '../components/UserForm';

const Stack = createStackNavigator();

export default function MainNavigation() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Welcome' }}
      />
      <Stack.Screen 
        name="UserForm" 
        component={UserForm} 
        options={{ title: 'Register' }}
      />
    </Stack.Navigator>
  );
}
