import React, { useCallback } from 'react';
import { Pressable, View, StyleProp, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Notifications, getNotificationsAsync, updateNotificationAsync } from '../../store/notificationSlice';
import CustomText from '../CustomText';
import layoutStyles from '../../styles/layout';
import notificationItemStyles from '../../styles/componentStyles/notifications/notificationItem';
import { NavigationProp } from '@react-navigation/native';
import { useAppDispatch } from '../../store/hooks';

interface Props {
  notification: Notifications;
  navigation: NavigationProp<any, any>;
  styles?: StyleProp<ViewStyle>;
};

const NotificationItem: React.FC<Props> = (props: Props) => {
  const {
    navigation,
    styles,
    notification: {
      id,
      title,
      description,
      viewed,
      groupId,
      postId,
      eventId,
      invite,
      user,
    }
  } = props;

  const dispatch = useAppDispatch();

  const navigationLocation = useCallback(() => {
    if (groupId) {
      navigation.navigate('Groups', { screen: 'View Group', initial: false, params: { groupId: groupId } });
    }
    if (postId) {
      navigation.navigate('Groups', { screen: 'View Comment', initial: false, params: { postId: postId } });
    }
    if (eventId) {
      navigation.navigate('Groups', { screen: 'View Group Event', initial: false, params: { eventId: eventId } });
    }
    if (invite) {
      navigation.navigate('Groups', { screen: 'Groups Landing', initial: false, params: { invite: true }});
    }
    return null;
  }, [groupId, postId, eventId, invite]);

  const clickAction = () => {
    if (!viewed) {
      dispatch(updateNotificationAsync({
        id: id,
        body: {
          viewed: true,
        }
      })).then(() => {
        dispatch(getNotificationsAsync());
      });
    }
    navigationLocation();
  }


  return (
    <Pressable
    style={[layoutStyles.flexRow, layoutStyles.alignItemCenter, layoutStyles.jBetween, notificationItemStyles.clickableContainer, !viewed && { borderColor:  '#CB1406'} ,  styles]}
    onPress={clickAction}
    >
      <View style={[{ flexGrow: 1 }]}>
        <CustomText h4>{title}</CustomText>
        <CustomText>{description}</CustomText>
      </View>
      <Image
        source={require('../../assets/icons/chevronRight.png')}
        style={[notificationItemStyles.chevronIcon]}
        contentFit='contain'
      />
    </Pressable>
  );
};

export default NotificationItem;

NotificationItem.defaultProps = {
  styles: [],
}
