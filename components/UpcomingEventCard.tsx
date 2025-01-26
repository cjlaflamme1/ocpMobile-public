import React from 'react';
import { View, ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';
import globalStyles from '../styles/global';
import groupCardStyles from '../styles/screenStyles/groups/groupCard';
import CustomText from './CustomText';
import { dateOnly } from '../services/timeAndDate';
import layoutStyles from '../styles/layout';

interface Props {
  eventTitle: string,
  eventDate: Date,
  imageSource?: ImageSourcePropType,
};

const UpcomingEventCard: React.FC<Props> = (props: Props) => {
  const {
    eventTitle,
    imageSource,
    eventDate
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
        <CustomText bold>
          {eventTitle}
        </CustomText>
        <View style={[layoutStyles.flexRow]}>
          <Image 
            source={require('../assets/icons/CalendarUnfocused.png')}
            style={[{width: 16, height: 16, alignSelf: 'center' }]}
            contentFit='contain'
          />
          <CustomText style={[globalStyles.mutedText, layoutStyles.ml_1]}>
            {eventDate && dateOnly(eventDate)}
          </CustomText>
        </View>
      </View>
    </View>
  );
};

UpcomingEventCard.defaultProps = {
  imageSource: undefined,
}

export default UpcomingEventCard;