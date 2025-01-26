import { StyleSheet } from 'react-native';

const searchLandingStyle = StyleSheet.create({
  searchBar: {
    flexGrow: 1,
    maxWidth: '100%',
    height: 40,
    padding: 10,
    backgroundColor: 'white',
    fontSize: 18,
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A3ACB1',
    borderRadius: 25,
    padding: 10,
    backgroundColor: 'white',
  },
  searchIconPressable: {
    height: '100%',
    backgroundColor: 'white',
    alignContent: 'center',
    padding: 10,
    borderRadius: 25,
  },
  searchIconPressed: {
    backgroundColor: 'grey',
  },
  radioTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  bottomBorder: {
    borderBottomColor: '#CB1406',
    borderBottomWidth: 1,
  },
  radioText: {
    padding: 10,
  },
});

export default searchLandingStyle;