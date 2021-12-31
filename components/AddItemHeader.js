import React from 'react';
import { View, Button, Text, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

export default function MyHeader() {
  const navigation = useNavigation();
  return (
    <View style={Styles.container}>
      <Text style={Styles.Title}>{'Scanner '}</Text>
      <Icon
        style={Styles.ScanButton}
        name='barcode-scan'
        size={30}
        onPress={() => {
          navigation.navigate('scanner');
        }}
      />
    </View>
  );
}

const Styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  Title: {
    paddingLeft: 168,
    fontSize: 17,
    fontWeight: '600',
  },
  ScanButton: {
    position: 'absolute',
    right: 25,
  },
});
