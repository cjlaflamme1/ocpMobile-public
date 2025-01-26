import { StyleSheet } from 'react-native';

const calendarStyles = StyleSheet.create({
  calendar: {
    minWidth: '95%',
    marginTop: 10,
    borderRadius: 12,
  },
  radioTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  radioText: {
    padding: 10,
  },
  bottomBorder: {
    borderBottomColor: '#CB1406',
    borderBottomWidth: 1,
  },
});

export default calendarStyles;