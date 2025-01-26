import { StyleSheet } from 'react-native';

const profileLandingStyles = StyleSheet.create({
  cardColumn: {
    maxWidth: '45%',
    width: '45%',
    marginTop: 20,
  },
  cardRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  editImagePressable: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    padding: 6,
    backgroundColor: '#CB1406',
    borderRadius: 50,
  },
  editImageIcon: {
    height: 30,
    width: 30,
    padding: 10,
  },
  editProfilePressable: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 6,
    display: 'flex',
    alignItems: 'center'
    // backgroundColor: '#CB1406',
    // borderRadius: 50,
  },
  editProfileIcon: {
    height: 20,
    width: 20,
    padding: 10,
  }
});

export default profileLandingStyles;