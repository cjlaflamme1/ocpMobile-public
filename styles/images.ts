import { StyleSheet } from 'react-native';

const imageStyles = StyleSheet.create({
  profileImage: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  profileImageContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  }
});

export default imageStyles;