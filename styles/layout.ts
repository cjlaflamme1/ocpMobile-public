import { StyleSheet } from 'react-native';

const layoutStyles = StyleSheet.create({
  mt_1: {
    marginTop: 10,
  },
  mt_2: {
    marginTop: 20,
  },
  mt_3: {
    marginTop: 30,
  },
  mb_1: {
    marginBottom: 10,
  },
  mb_2: {
    marginBottom: 20,
  },
  mb_3: {
    marginBottom: 30,
  },
  m_1: {
    margin: 10,
  },
  m_2: {
    margin: 20,
  },
  m_3: {
    margin: 30,
  },
  ml_1: {
    marginLeft: 10,
  },
  ml_2: {
    marginLeft: 20,
  },
  ml_3: {
    marginLeft: 30,
  },
  mr_1: {
    marginRight: 10,
  },
  mr_2: {
    marginRight: 20,
  },
  mr_3: {
    marginRight: 30,
  },
  dFlex: {
    display: 'flex',
  },
  jCenter: {
    justifyContent: 'center',
  },
  jBetween: {
    justifyContent: 'space-between',
  },
  jEnd: {
    justifyContent: 'flex-end'
  },
  jStart: {
    justifyContent: 'flex-start',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  alignItemCenter: {
    alignItems: 'center',
  },
  alignItemStart: {
    alignItems: 'flex-start',
  },
  alignItemEnd: {
    alignItems: 'flex-end',
  },
  screenContainer: {
    width: '100%',
    paddingLeft: 15,
    paddingRight: 15,
    flexGrow: 1,
  }
});

export default layoutStyles;