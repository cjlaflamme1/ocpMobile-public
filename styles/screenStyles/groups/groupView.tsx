import { StyleSheet } from 'react-native';

const groupViewStyle = StyleSheet.create({
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
  viewMembersButton: {
    padding: 10,
  },
});

export default groupViewStyle;