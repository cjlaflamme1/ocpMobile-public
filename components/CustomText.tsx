import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import globalStyles from '../styles/global';

interface Props {
  children: any,
  bold?: boolean,
  bolder?: boolean,
  h4?: boolean,
  h3?: boolean,
  h2?: boolean,
  h1?: boolean,
  style?: StyleProp<TextStyle>,
  center?: boolean,
  left?: boolean,
  right?: boolean,
};

const CustomText: React.FC<Props> = (props: Props) => {
  const {
    children,
    bold,
    bolder,
    h4,
    h3,
    h2,
    h1,
    style,
    center,
    left,
    right,
  } = props;

  return (
    <Text
      style={[
        globalStyles.regularFont,
        globalStyles.p,
        (bold && globalStyles.boldfont),
        (bolder && globalStyles.bolderFont),
        (h4 && globalStyles.h4),
        (h3 && globalStyles.h3),
        (h2 && globalStyles.h2),
        (h1 && globalStyles.h1),
        (center && globalStyles.tCenter),
        (left && globalStyles.tLeft),
        (right && globalStyles.tRight),
        (style && style)
      ]}
    >
      {children}
    </Text>
  );
};

CustomText.defaultProps = {
  bold: false,
  bolder: false,
  h4: false,
  h3: false,
  h2: false,
  h1: false,
  style: [],
  center: false,
  left: false,
  right: false,
}

export default CustomText;