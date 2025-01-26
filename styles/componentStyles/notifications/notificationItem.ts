import { StyleSheet } from 'react-native';

const notificationItemStyles = StyleSheet.create({
  helpIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  chevronIcon: {
    width: 7,
    height: 12,
  },
  clickableContainer: {
    backgroundColor: 'white',
    padding: 12,
    paddingLeft: 16,
    paddingRight: 16,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 20,
  }
});

export default notificationItemStyles;