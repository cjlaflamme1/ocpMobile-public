import { StyleSheet } from 'react-native';

const bottomSheet = StyleSheet.create({
  scrollView: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center'
  },
  itemContainer: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 40,
    marginRight: 40
  },
  itemIcon: {
    height: 24,
    width: 24,
    marginRight: 10
  }
});

export default bottomSheet;