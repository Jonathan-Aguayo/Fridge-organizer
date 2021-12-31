import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  View,
  Text,
  Button,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import Scanner from '../screens/ProductScanner';
import MyHeader from '..//components/AddItemHeader';
import AddItem from '../screens/AddItem';

const Stack = createNativeStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator initialRouteName='Add Item'>
      <Stack.Screen
        name='Add Item'
        component={AddItem}
        options={{
          headerTitle: (props) => <MyHeader navigation={props.navigation} />,
        }}
      />
      <Stack.Screen name='scanner' component={Scanner} />
    </Stack.Navigator>
  );
}
