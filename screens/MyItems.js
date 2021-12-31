import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import MyItem from '../components/MyItem';
import * as SQLite from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';

const db = SQLite.openDatabase('FoodDB');

export default function MyItems({ navigation, route }) {
  const [foodItems, setFoodItems] = React.useState([]);
  const [sort, setSort] = React.useState('newest');

  useFocusEffect(() => {
    getData();
  });

  async function deleteItem(itemID) {
    await db.transaction(
      (tx) => {
        tx.executeSql('DELETE FROM FOOD WHERE ID = ?', [itemID]);
      },
      (error) => {
        console.log(error);
      }
    );
    foodItems.filter((item) => {
      item.id != itemID;
    });

    const newFoodItems = foodItems.slice();
    setFoodItems(newFoodItems);
  }

  async function updateItem(id, newQuantity) {
    db.transaction(
      (tx) => {
        tx.executeSql('UPDATE FOOD ' + 'SET QUANTITY = ? ' + 'WHERE ID = ?', [
          newQuantity,
          id,
        ]);
      },
      (error) => {
        console.log(error);
      }
    );
    const itemIndex = foodItems.indexOf((item) => item.ID == id);
    const item = foodItems.find((item) => item.ID == id);
    item.QUANTITY = newQuantity;
    console.log(id);
    console.log(itemIndex);
    console.log(item);
    setFoodItems(foodItems.splice(itemIndex, 1, item));
  }

  const createTable = async () => {
    await db.transaction(
      (tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
            'FOOD ' +
            ' (ID INTEGER PRIMARY KEY AUTOINCREMENT, PRODUCTNAME TEXT, IMAGEURI TEXT, DATEADDED TEXT, STATUS TEXT, QUANTITY INTEGER)'
        );
      },
      (error) => {
        console.log(error);
      },
      () => {
        console.log('created db');
      }
    );
  };

  const getData = async () => {
    try {
      const create = await createTable();
      db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT ID, PRODUCTNAME, DATEADDED , IMAGEURI, STATUS, QUANTITY FROM FOOD',
            [],
            (tx, results) => {
              const len = results.rows.length;
              if (len != foodItems.length) {
                setFoodItems(results.rows._array);
              }
            }
          );
        },
        (error) => console.log(error),
        () => {
          console.log('successfully selected from db');
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {foodItems.length > 0 ? (
          foodItems.map((item) => (
            <MyItem
              id={item.ID}
              title={item.PRODUCTNAME}
              dateAdded={item.DATEADDED}
              status={item.STATUS}
              uri={item.IMAGEURI}
              quantity={item.QUANTITY}
              key={item.ID}
              deleteItem={deleteItem}
              updateItem={updateItem}
            />
          ))
        ) : (
          <Text />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
});
