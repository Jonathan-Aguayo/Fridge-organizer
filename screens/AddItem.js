import React from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('FoodDB');

export default function Home({ navigation, route }) {
  const [itemImage, setItemImage] = React.useState();
  const [itemName, setItemName] = React.useState();
  const [quanitity, setQuantity] = React.useState('1');
  const [isFromWeb, setIsFromWeb] = React.useState(false);

  React.useEffect(() => {
    if (route.params) {
      setItemImage(route.params.itemImage);
      setItemName(route.params.itemName);
      setIsFromWeb(true);
    }
  }, [route.params]);

  async function takeItemImage() {
    const { status } = await ImagePicker.getCameraPermissionsAsync();

    if (status != 'granted') {
      alert('We need camera permissions to take pictures of your fridge items');
    } else {
      const result = await ImagePicker.launchCameraAsync({ quality: 0 });
      if (!result.cancelled) {
        console.log(result.uri);
        setItemImage(result.uri);
      }
    }
  }

  const createTable = async () => {
    await db.transaction(
      (tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
            'FOOD ' +
            ' (ID INTEGER PRIMARY KEY AUTOINCREMENT, PRODUCTNAME TEXT, IMAGEURI TEXT, DATEADDED TEXT, STATUS TEXT, QUANTITY TEXT)'
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
    const create = await createTable();
    if (itemName && itemImage) {
      try {
        let uri = '';
        if (isFromWeb) {
          uri = itemImage;
        } else {
          uri = await (await MediaLibrary.createAssetAsync(itemImage)).uri;
        }
        db.transaction(
          (tx) => {
            tx.executeSql(
              'INSERT INTO FOOD (PRODUCTNAME, IMAGEURI, DATEADDED, STATUS, QUANTITY) VALUES (?, ?, ?, ?, ?)',
              [
                itemName,
                uri,
                new Date().toLocaleDateString(),
                'Communal',
                quanitity,
              ]
            );
          },
          (error) => {
            console.log(error);
          },
          () => {
            clear();
            Keyboard.dismiss();
            alert('Successfully added item!');
          }
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      alert('Item must have a name and image before it can be added');
    }
  };

  function clear() {
    setItemImage();
    setItemName();
    setQuantity('1');
    setIsFromWeb(false);
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ flex: 1, justifyContent: 'flex-start' }}>
        {itemImage ? (
          <Pressable onLongPress={takeItemImage}>
            <Image
              style={style.UploadedItemImage}
              source={{ uri: itemImage }}
            />
          </Pressable>
        ) : (
          <Text style={style.AddPhotoButton} onPress={takeItemImage}>
            {' '}
            {'Add photo'}{' '}
          </Text>
        )}
        <TextInput
          style={style.ItemAddInput}
          placeholder='Item name'
          clearButtonMode='while-editing'
          onChangeText={setItemName}
          value={itemName}
        ></TextInput>
        <TextInput
          style={style.ItemAddInput}
          placeholder='Quanitity'
          clearButtonMode='while-editing'
          onChangeText={setQuantity}
          value={quanitity}
          keyboardType='numeric'
        ></TextInput>

        <View style={style.ItemAddButtonContainer}>
          <Text style={style.ItemClearButton} color={'red'} onPress={clear}>
            {'Clear'}
          </Text>
          <Text
            style={style.ItemAddButton}
            color={'green'}
            onPress={insertIntoDB}
          >
            {' Add '}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const style = StyleSheet.create({
  UploadedItemImage: {
    height: 300,
    width: 350,
    alignSelf: 'center',
    marginVertical: 20,
  },
  ItemAddInput: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#1f4166',
    width: 300,
    height: 50,
    padding: 10,
    marginVertical: 5,
  },
  AddPhotoButton: {
    alignSelf: 'center',
    fontSize: 50,
    backgroundColor: '#1f4166',
    color: 'white',
    marginVertical: 50,
    borderRadius: 10,
    overflow: 'hidden',
    padding: 5,
  },
  ItemAddButtonContainer: {
    marginTop: 50,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  ItemAddButton: {
    fontSize: 30,
    backgroundColor: '#1f4166',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 5,
    color: 'white',
    width: 150,
    textAlign: 'center',
  },
  ItemClearButton: {
    fontSize: 30,
    borderRadius: 10,
    overflow: 'hidden',
    padding: 5,
    borderColor: '#1f4166',
    borderWidth: 2,
    width: 150,
    textAlign: 'center',
  },
});
