import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Modal,
  Switch,
  Keyboard,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import * as SQLite from 'expo-sqlite';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const db = SQLite.openDatabase('FoodDB');

export default function MyItem({
  uri,
  dateAdded,
  status,
  title,
  quantity,
  id,
  deleteItem,
  updateItem,
}) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editQuantity, setEditQuantity] = React.useState();
  return (
    <View>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Icon
              name='close-circle'
              size={25}
              style={{ alignSelf: 'flex-end', marginBottom: 15 }}
              onPress={() => setModalVisible(false)}
            />
            <Text style={styles.modalText}>{`Edit ${title}`}</Text>
            <TextInput
              style={styles.ItemAddInput}
              keyboardType='numeric'
              placeholder='Edit quanity'
              onChangeText={setEditQuantity}
            />
            <View style={styles.contentContainer}>
              <Text
                style={styles.deleteItem}
                onPress={() => {
                  setModalVisible(false);
                  deleteItem(id);
                }}
              >
                Delete item
              </Text>
              <Text
                style={styles.saveItem}
                onPress={() => {
                  setModalVisible(false);
                  updateItem(Number.parseInt(id), editQuantity);
                }}
              >
                {' '}
                Save Changes{' '}
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      <Pressable
        style={styles.listItems}
        onLongPress={() => setModalVisible(true)}
      >
        <Image style={styles.tinyLogo} source={{ uri: uri }} />
        <Text style={styles.itemTitle} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.itemText}>{`Date added: ${dateAdded}`}</Text>
        <Text style={styles.itemText}>{`Quantity: ${quantity}`}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    maxHeight: 40,
    width: 300,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItems: {
    borderWidth: 0.2,
    borderRadius: 20,
    borderColor: '#1f4166',
    marginTop: 12,
    height: 360,
    width: 200,
    marginHorizontal: 7,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  tinyLogo: {
    width: 198,
    height: 275,
    resizeMode: 'contain',
    borderRadius: 19,
    maxHeight: 275,
  },
  itemText: {
    marginBottom: 5,
    marginLeft: 10,
  },
  itemTitle: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    marginHorizontal: 2,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
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
  deleteItem: {
    color: 'white',
    borderColor: 'black',
    padding: 5,
    fontSize: 20,
    backgroundColor: 'red',
  },
  saveItem: {
    color: 'white',
    padding: 5,
    fontSize: 20,
    backgroundColor: '#1f4166',
  },
});
