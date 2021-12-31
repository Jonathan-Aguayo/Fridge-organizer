import { React, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Button,
  Modal,
} from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('FoodDB');

const deleteTable = () => {
  try {
    db.transaction(
      (tx) => {
        tx.executeSql('DROP TABLE FOOD');
      },
      (error) => console.log(error),
      () => {
        alert('All items deleted');
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export default function OurFridge() {
  return (
    <View style={styles.container}>
      <Button title={'Delete all items'} onPress={deleteTable} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
