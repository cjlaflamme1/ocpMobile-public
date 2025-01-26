import React, { memo, useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import CustomText from '../../components/CustomText';
import layoutStyles from '../../styles/layout';
import globalStyles from '../../styles/global';
import groupViewStyle from '../../styles/screenStyles/groups/groupView';
import { useAppDispatch } from '../../store/hooks';
import { createPostResponseAsync } from '../../store/groupPostSlice';
import { NavigationProp } from '@react-navigation/native';
import CommentResponse from '../../components/groups/CommentResponse';
import { dateAndTime, dayOfWeek, timeSince } from '../../services/timeAndDate';
import { GroupEvent, clearSelectedEvent, getOneGroupEventAsync, updateGroupEventAsync } from '../../store/groupEventSlice';
import PrimaryButton from '../PrimaryButton';
import { User } from '../../store/userSlice';
import UserListModal from '../modals/UserListModal';

interface Props {
  navigation: NavigationProp<any, any>;
  event: GroupEvent;
  currentUser: User;
};

const ViewEvent: React.FC<Props> = memo(({ navigation, event, currentUser }) => {
  const [joinButtonDisabled, setJoinButtonDisabled] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearSelectedEvent());
    }
  }, [navigation]);

  if (!event) {
    return (<View />);
  };

  const joinEvent = async () => {
    setJoinButtonDisabled(true);
    const res = await dispatch(updateGroupEventAsync({
      id: event.id,
      data: {
        attendingUserIds: [currentUser.id]
      },
    }));
    if (res.meta.requestStatus === 'fulfilled') {
      await dispatch(getOneGroupEventAsync(event.id));
      setJoinButtonDisabled(false);
      return true;
    }
    setJoinButtonDisabled(false);
    return false;
  };

  const submitPostResponse = async (postBody: string) => {
    const res = await dispatch(createPostResponseAsync({
      responseText: postBody,
      groupEventId: event.id,
    }));
    if (res.meta.requestStatus === 'fulfilled') {
      await dispatch(getOneGroupEventAsync(event.id));
      return true;
    } else {
      return false;
    }
  };

  const { width } = Dimensions.get('window');

  return (
    <View style={[{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1}]}>
      <View style={[layoutStyles.mb_3]}>
        <View style={[layoutStyles.mt_2]}>
          {
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
            <CustomText h1 bold>
              {event.cancelled && 'CANCELED - '}{event.title}
            </CustomText>
          </View>
          <View style={[layoutStyles.mt_1, layoutStyles.mb_1]}>
            <CustomText h3 style={[layoutStyles.mb_1]}>
              {dayOfWeek(event.eventDate)}
            </CustomText>
            <CustomText h3>
              {dateAndTime(event.eventDate)}
            </CustomText>
          </View>
          <View style={[layoutStyles.mt_1, layoutStyles.mb_1]}>
            <CustomText>
              {event.description}
            </CustomText>
          </View>
          <View style={[layoutStyles.dFlex, layoutStyles.flexRow, layoutStyles.mt_1, layoutStyles.mb_1]}>
            <Pressable style={[groupViewStyle.viewMembersButton]} onPress={() => setUserModal(true)}>
              <CustomText style={[{ textDecorationLine: 'underline' }]}>
                {`${event.attendingUsers ? event.attendingUsers.length : 0} ${event.attendingUsers && event.attendingUsers.length === 1 ? 'person' : 'people'} attending.`}
              </CustomText>
            </Pressable>
          </View>
          <View style={[layoutStyles.mt_1, layoutStyles.mb_1]}>
            {
              !event.attendingUsers ||
              event.attendingUsers.length === 0 ||
              !event.attendingUsers.find((user) => user.id === currentUser.id) ?
              (
                <PrimaryButton
                  buttonText='Join Event'
                  disabled={joinButtonDisabled}
                  callback={joinEvent}
                />
              ) : (
                <PrimaryButton
                  buttonText='Attending'
                  disabled
                  outline
                  callback={() => console.log('join event')}
                />
              )
            }
          </View>
          <View style={[layoutStyles.mb_3]}>
            <CommentResponse
              buttonText='Submit Comment'
              placeholderText='Enter comment here...'
              handleSubmit={(e) => submitPostResponse(e)}
              navigation={navigation}
            />
          </View>
        </View>
        {
          event.responses &&
          event.responses.length > 0 ?
          event.responses
            .slice()
            .sort((a, b) => a.createdAt.valueOf() < b.createdAt.valueOf() ? 1 : -1)
            .map((postResponse) => (
            <View key={`postResponse-${postResponse.id}`}>
              <View style={[layoutStyles.flexRow, layoutStyles.jBetween, layoutStyles.mt_1, layoutStyles.mb_1]}>
                <View style={[layoutStyles.flexRow, layoutStyles.alignItemCenter]}>
                  <Image
                    source={
                        postResponse.author &&
                        postResponse.author.imageGetUrl ?
                          { uri: postResponse.author.imageGetUrl } :
                          require('../../assets/150x150.png')
                    }
                    contentFit='contain'
                    style={[eventStyle.postProfileImage, layoutStyles.mr_2]}
                  />
                  <CustomText>{`${postResponse.author.firstName} ${postResponse.author.lastName}`}</CustomText>
                </View>
              </View>
              <View style={[eventStyle.cardContainer]}>
                <CustomText>{postResponse.responseText}</CustomText>
              </View>
              <View style={[layoutStyles.mt_1, layoutStyles.mb_1, layoutStyles.alignItemEnd]}>
                <CustomText style={[ globalStyles.mutedText]}>
                  {timeSince(new Date(postResponse.createdAt))} ago
                </CustomText>
              </View>
            </View>
          )) : (
            <View>
              <View style={[eventStyle.cardContainer]}>
                <CustomText>No responses yet.</CustomText>
              </View>
            </View>
          )
        }
      </View>
      <UserListModal
        navigation={navigation}
        isVisible={userModal}
        closeModal={() => setUserModal(false)}
        userList={[...new Set([...(event.attendingUsers || [])])]}
      />
    </View>
  );
});

export default ViewEvent;

const eventStyle = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
  },
  postProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 25,
  }
});