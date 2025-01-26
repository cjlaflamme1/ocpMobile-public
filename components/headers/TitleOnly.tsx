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
  // profileFunction: Function;
}

const TitleOnly: React.FC<Props> = ({ title }) => {
  // const { profileFunction } = props;
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[layoutStyles.flexRow, layoutStyles.alignItemCenter, layoutStyles.jCenter, titleWithButtonStyle.headerContainer, { paddingTop: insets.top + 5 }]}
    >
      <View style={[layoutStyles.mt_1, layoutStyles.mb_1]}>
        <CustomText bold h4>{title}</CustomText>
      </View>
    </View>
  );
};

export default TitleOnly;
