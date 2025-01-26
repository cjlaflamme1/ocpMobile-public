import React from 'react';
import {
  View, Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import layoutStyles from '../../styles/layout';
import CustomText from '../CustomText';
import titleWithButtonStyle from '../../styles/headerStyles/titleWithButton';
import { NavigationProp } from '@react-navigation/native';

interface Props {
  nav?: {
    navigation: NavigationProp<any, any>;
    defaultView: string;
  }
  title: string;
  // profileFunction: Function;
}

const TitleWithBackButton: React.FC<Props> = ({ nav, title }) => {
  // const { profileFunction } = props;
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[layoutStyles.flexRow, layoutStyles.alignItemCenter, layoutStyles.jBetween, titleWithButtonStyle.headerContainer, { paddingTop: insets.top + 5 }]}
    >
      <View>
        {
          nav && nav.navigation ? (
            <Pressable
              onPress={() => nav.navigation.canGoBack() ? nav.navigation.goBack() : nav.navigation.navigate(nav.defaultView)}
              style={[titleWithButtonStyle.iconButton, layoutStyles.alignItemCenter, layoutStyles.jCenter]}
            >
              <Image
                style={[titleWithButtonStyle.icon]}
                source={require('../../assets/icons/backButtonIcon.png')}
                contentFit='contain'
              />
            </Pressable>
          ) : (
            <Pressable
              disabled
              style={[titleWithButtonStyle.iconButton, layoutStyles.alignItemCenter, layoutStyles.jCenter]}
            >
              <Image
                style={[titleWithButtonStyle.icon]}
                source={require('../../assets/icons/backButtonIcon.png')}
                contentFit='contain'
              />
            </Pressable>
          )
        }
      </View>
      <View style={[layoutStyles.mt_1, layoutStyles.mb_1]}>
        <CustomText bold h4>{title}</CustomText>
      </View>
      <View style={[titleWithButtonStyle.iconButton]} />
    </View>
  );
};

export default TitleWithBackButton;

TitleWithBackButton.defaultProps = {
  nav: undefined,
}