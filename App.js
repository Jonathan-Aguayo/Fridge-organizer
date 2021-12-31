import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Scanner from './screens/ProductScanner';
import { View, Text, Button } from 'react-native';
import MyItems from './screens/MyItems';
import OurFridge from './screens/Settings';
import MyStack from './Navigators/ScannerStack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Tab = createBottomTabNavigator();

function Home(props) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{'Welcome Home'}</Text>
      <Button
        title='Go to scanner'
        onPress={() => props.navigation.navigate('scanner')}
      />

      <Button
        title='My items'
        onPress={() => props.navigation.navigate('My items')}
      />

      <Button
        title='Our Fridge'
        onPress={() => props.navigation.navigate('Our fridge')}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName='Add'
        screenOptions={{ tabBarActiveTintColor: '#1f4166' }}
      >
        <Tab.Screen
          name='Add'
          component={MyStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ size, color }) => (
              <Icon name='plus-circle-outline' size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name='My items'
          component={MyItems}
          options={{
            tabBarIcon: ({ size, color }) => (
              <Icon name='fridge' size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name='Settings'
          component={OurFridge}
          options={{
            tabBarIcon: ({ size, color }) => (
              <Icon name='cog' size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
