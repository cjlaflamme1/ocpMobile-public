import React from 'react';
import { View, ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';
import cardStyles from '../styles/card';
import CustomText from './CustomText';

interface Props {
  children: any,
  imageSource?: ImageSourcePropType,
};

const ProfileActivityCard: React.FC<Props> = (props: Props) => {
  const {
    children,
    imageSource
  } = props;

  return (
    <View style={[cardStyles.cardBackground]}>
      <View style={[cardStyles.imageContainer]}>
        {
          imageSource &&
          (
            <Image
              source={imageSource}
              style={[cardStyles.image]}
            />
          )
        }
      </View>
      <View style={[cardStyles.textContainer]}>
        <CustomText bold>
          {children}
        </CustomText>
      </View>
    </View>
  );
};

ProfileActivityCard.defaultProps = {
  imageSource: undefined,
}

export default ProfileActivityCard;