import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('FoodDB');

export default function Scanner(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [upc, setUpc] = useState('');
  const [data, setData] = useState('');
  const [imageUri, setImageUri] = useState();
  React.useEffect(() => {
    createTable();
  }, []);

  async function fetchUpcItem(data) {
    const res = await fetch(
      `https://api.edamam.com/api/food-database/v2/parser?app_id=d4ca803d&app_key=02445b8cbe4dfae9de175174a70a728c&upc=${data}&nutrition-type=cooking`
    );

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      const error = await res.json();
      return error;
    }
  }

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const createTable = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
            'FOOD ' +
            ' (ID INTEGER PRIMARY KEY AUTOINCREMENT, PRODUCTNAME TEXT, IMAGEURI TEXT, DATEADDED DATE, STATUS TEXT)'
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

  const insertIntoDB = async () => {
    try {
      await db.transaction(
        (tx) => {
          tx.executeSql(
            'INSERT INTO FOOD (PRODUCTNAME, IMAGEURI, DATEADDED, STATUS) VALUES (?, ?, ?, ? )',
            [data, imageUri ? imageUri : '', Date.now(), 'Communal']
          );
        },
        (error) => {
          console.log(error);
        },
        () => {
          console.log('successfully inserted into db');
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    const result = await fetchUpcItem(data);
    if (result.error) {
      setScanned(true);
      setData(result.message);
    } else {
      props.navigation.navigate({
        name: 'Add Item',
        params: {
          itemName: result.hints[0].food.label,
          itemImage: result.hints[0].food.image,
        },
      });
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {scanned ? (
        <View style={styles.errorContainer}>
          <Text style={styles.mainText}>{data}</Text>
          <Button
            title='Add manually'
            onPress={() => {
              props.navigation.navigate('Add Item');
            }}
          />

          {scanned && (
            <Button
              title={'Tap to Scan Again'}
              onPress={() => {
                setScanned(false);
                setImageUri();
              }}
            />
          )}
        </View>
      ) : (
        <View style={styles.barcodeContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ height: 500, width: 550 }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 450,
    width: 400,
    overflow: 'hidden',
    borderRadius: 35,
    marginTop: 75,
  },
  mainText: {
    fontSize: 15,
    marginBottom: 25,
  },
  tinyLogo: {
    width: 200,
    height: 350,
    resizeMode: 'contain',
    borderColor: '#333',
    borderWidth: 2,
    marginTop: 75,
  },
  logo: {
    width: 66,
    height: 58,
  },
  hidden: {
    display: 'none',
  },
});
