import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  regularFont: {
    fontFamily: 'Manrope_400Regular',
  },
  boldfont: {
    fontFamily: 'Manrope_600SemiBold',
  },
  bolderFont: {
    fontFamily: 'Manrope_800ExtraBold',
  },
  h1: {
    fontSize: 32,
  },
  h2: {
    fontSize: 28,
  },
  h3: {
    fontSize:24,
  },
  h4: {
    fontSize: 20
  },
  p: {
    fontSize: 16,
  },
  tCenter: {
    textAlign: 'center',
  },
  tLeft: {
    textAlign: 'left',
  },
  tRight: {
    textAlign: 'right',
  },
  redLink: {
    color: '#CB1406',
  },
  navigationStackScreen: {
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
  },
  mutedText: {
    color: '#8A8A8A',
  },
  hr: {
    borderBottomColor: '#A3ACB1',
    borderBottomWidth: 1,
    width: '100%'
  }
});

export default globalStyles;