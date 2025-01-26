import { StyleSheet } from 'react-native';

const createGroupStyles = StyleSheet.create({
  addImagePressable: {
    height: 100,
    width: 100,
    backgroundColor: '#EDEDED',
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  addImageContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  pressed: {
    backgroundColor: 'grey',
  },
  editImageIcon: {
    height: 30,
    width: 30,
    padding: 10,
  },
  editImagePressable: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    padding: 6,
    backgroundColor: '#CB1406',
    borderRadius: 50,
  }
});

export default createGroupStyles;