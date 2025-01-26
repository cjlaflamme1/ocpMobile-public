import { StyleSheet } from 'react-native';

const groupCardStyles = StyleSheet.create({
  cardBackground: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    padding: 5,
    marginTop: 20,
  },
  imageContainer: {
    padding: 10,
    height: 100,
    width: 100,
  },
  textContainer: {
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    flexGrow: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  }
});

export default groupCardStyles;