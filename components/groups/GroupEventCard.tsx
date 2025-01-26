import React, { useEffect } from 'react';
import { View, ImageSourcePropType, Pressable, TextInput, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import CustomText from '../CustomText';
import globalStyles from '../../styles/global';
import layoutStyles from '../../styles/layout';
import { dateAndTime, dayOfWeek, timeSince } from '../../services/timeAndDate';
import { useAppDispatch } from '../../store/hooks';
import { getOneGroupPostAsync } from '../../store/groupPostSlice';
import { NavigationProp, useRoute } from '@react-navigation/native';
import { GroupEvent, getOneGroupEventAsync } from '../../store/groupEventSlice';

interface Props {
  userPosted: { name: string, profile: ImageSourcePropType },
  event: GroupEvent,
  responseCount: number;
  joiningCount: number;
  navigation: NavigationProp<any, any>;
};

const EventCard: React.FC<Props> = (props: Props) => {
  const {
    userPosted,
    event,
    responseCount,
    joiningCount,
    navigation,
  } = props;
  const route = useRoute();

  const viewEvent = (id: string) => {
    navigation.navigate('View Group Event', { eventId: id });
  };
  const { width } = Dimensions.get('window');

  return (
    <View style={[eventStyle.cardContainer, (event.cancelled && eventStyle.cancelledEvent)]}>
      <Pressable
        onPress={() => viewEvent(event.id)}
      >
        <View style={[layoutStyles.flexRow, layoutStyles.jBetween, layoutStyles.mt_1, layoutStyles.mb_1]}>
          <View style={[layoutStyles.flexRow, layoutStyles.alignItemCenter]}>
            <Image
              source={userPosted.profile}
              style={[eventStyle.postProfileImage, layoutStyles.mr_2]}
              contentFit='contain'
            />
            <CustomText>{userPosted.name}</CustomText>
          </View>
          <View>
            <CustomText style={[ globalStyles.mutedText]}>
              {timeSince(new Date(event.createdAt))} ago
            </CustomText>
          </View>
        </View>
        {
          event &&
          event.imageGetUrl &&
          (
            <View>
              <Image
                source={{ uri: event.imageGetUrl }}
                style={[{ width: '100%', height: (width * 0.75), borderRadius: 25}]}
              />
            </View>
          )
        }
        <View style={[layoutStyles.mt_1, layoutStyles.mb_1]}>
          <CustomText h3>
            { event.cancelled && 'CANCELLED - ' }{event.title}
          </CustomText>
        </View>
        <View style={[layoutStyles.mt_1, layoutStyles.mb_1]}>
          <CustomText style={[layoutStyles.mb_1]}>
            {dayOfWeek(event.eventDate)}
          </CustomText>
          <CustomText>
            {dateAndTime(event.eventDate)}
          </CustomText>
        </View>
        <View style={[layoutStyles.flexRow, layoutStyles.jBetween, layoutStyles.mt_2, layoutStyles.mb_1]}>
          {/* TODO: replace 'likes' with clickable response options that are set by posting user: such as 'yes', 'no' 'maybe', whatev */}
          {/* <View style={[layoutStyles.flexRow]}>
            <Pressable onPress={() => console.log('I like it!')}>
              <Image
                style={[eventStyle.iconStyle]}
                source={require('../../assets/icons/heartempty.png')}
              />
            </Pressable>
            <CustomText style={[globalStyles.mutedText, layoutStyles.ml_1]}>1k</CustomText>
          </View> */}
          {
            route.name !== "View Comment" &&
            (
              <View style={[layoutStyles.flexRow]}>
                <Image
                  style={[eventStyle.iconStyle]}
                  source={require('../../assets/icons/comment.png')}
                  contentFit='contain'
                />
                <CustomText style={[globalStyles.mutedText, layoutStyles.ml_1]}>
                  {`${responseCount} comment${(responseCount !== 1) ? 's' : ''}`}
                </CustomText>
              </View>
            )
          }
          {
            route.name !== "View Comment" &&
            (
              <View style={[layoutStyles.flexRow]}>
                <Image
                  style={[eventStyle.iconStyle]}
                  source={require('../../assets/icons/GroupsUnfocused.png')}
                  contentFit='contain'
                />
                <CustomText style={[globalStyles.mutedText, layoutStyles.ml_1]}>
                  {`${joiningCount} joining`}
                </CustomText>
              </View>
            )
          }
          {/* TODO: Share will be added when/if direct messaging exists */}
          {/* <View style={[layoutStyles.flexRow]}>
            <Pressable onPress={() => console.log('I want to share it!')}>
              <Image
                style={[eventStyle.iconStyle]}
                source={require('../../assets/icons/share.png')}
              />
            </Pressable>
            <CustomText style={[globalStyles.mutedText, layoutStyles.ml_1]}>1k</CustomText>
          </View> */}
        </View>
      </Pressable>
    </View>
  );
};

export default EventCard;

const eventStyle = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 16,
  },
  postProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 25,
  },
  iconStyle: {
    height: 25,
    width: 25,
  },
  cancelledEvent: {
    borderColor: 'red',
    borderWidth: 1,
  }
});