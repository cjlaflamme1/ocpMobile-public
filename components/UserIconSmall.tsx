import React from 'react';
import { View, ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';
import layoutStyles from '../styles/layout';
import CustomText from './CustomText';

interface Props {
  userName: string,
  imageSource?: ImageSourcePropType,
};

const UserIconSmall: React.FC<Props> = (props: Props) => {
  const {
    userName,
    imageSource,
  } = props;

  return (
    <View style={[layoutStyles.mt_1]}>
      <View style={[layoutStyles.dFlex, layoutStyles.alignItemCenter, { maxWidth: '95%'}]}>
        {
          imageSource &&
          (
            <Image
              source={imageSource}
              style={[{ width: 72, height: 72, borderRadius: 50 }]}
            />
          )
        }
      </View>
      <View style={[{ maxWidth: '95%' }, layoutStyles.dFlex, layoutStyles.alignItemCenter]}>
        <CustomText style={[{ textAlign: 'center', fontSize: 12}]}>{userName}</CustomText>
      </View>
    </View>
  );
};

UserIconSmall.defaultProps = {
  imageSource: undefined,
}

export default UserIconSmall;