import React from 'react';
import {
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import layoutStyles from '../../styles/layout';
import CustomText from '../CustomText';
import titleWithButtonStyle from '../../styles/headerStyles/titleWithButton';

interface Props {
  title: string;
  children: any;
  // profileFunction: Function;
}

const TitleAndAction: React.FC<Props> = ({ title, children }) => {
  // const { profileFunction } = props;
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[layoutStyles.flexRow, layoutStyles.alignItemCenter, layoutStyles.jBetween, titleWithButtonStyle.headerContainer, { paddingTop: insets.top + 5 }]}
    >
      <View style={[titleWithButtonStyle.iconButton]} />
      <View style={[layoutStyles.mt_1, layoutStyles.mb_1]}>
        <CustomText center bold h4 style={{ maxWidth: '95%', flexGrow: 1 }}>{title}</CustomText>
      </View>
      <View>
        {children}
      </View>
    </View>
  );
};

export default TitleAndAction;
