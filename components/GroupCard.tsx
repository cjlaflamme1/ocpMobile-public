import React from 'react';
import { View, ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';
import globalStyles from '../styles/global';
import groupCardStyles from '../styles/screenStyles/groups/groupCard';
import CustomText from './CustomText';

interface Props {
  groupTitle: string,
  numberOfMembers: number,
  imageSource?: ImageSourcePropType,
  hideCount?: boolean,
};

const GroupCard: React.FC<Props> = (props: Props) => {
  const {
    groupTitle,
    imageSource,
    numberOfMembers,
    hideCount,
  } = props;

  return (
    <View style={[groupCardStyles.cardBackground]}>
      <View style={[groupCardStyles.imageContainer]}>
        {
          imageSource &&
          (
            <Image
              source={imageSource}
              style={[groupCardStyles.image]}
            />
          )
        }
      </View>
      <View style={[groupCardStyles.textContainer]}>
        <CustomText bold style={{ maxWidth: '90%' }}>
          {groupTitle}
        </CustomText>
        {
          !hideCount && (
            <CustomText style={[globalStyles.mutedText]}>
              {`${numberOfMembers} member${(numberOfMembers !== 1) ? 's' : ''}`}
            </CustomText>
          )
        }
      </View>
    </View>
  );
};

GroupCard.defaultProps = {
  imageSource: undefined,
  hideCount: false,
}

export default GroupCard;