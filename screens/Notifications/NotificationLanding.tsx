import React, { useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, View } from 'react-native';
import layoutStyles from '../../styles/layout';
import CustomText from '../../components/CustomText';
import NotificationItem from '../../components/notifications/NotificationItem';
import { NavigationProp } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getNotificationsAsync, updateNotificationAsync } from '../../store/notificationSlice';
import globalStyles from '../../styles/global';

interface Props {
  navigation: NavigationProp<any, any>;
};

const NotificationLanding: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState(false);

  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notificationState.notifications);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getNotificationsAsync());
    setRefreshing(false);
  }

  useEffect(() => {
    dispatch(getNotificationsAsync());
  }, [navigation]);

  const markAllAsRead = async () => {
    setUpdating(true);
    if (notifications) {
      const ids = notifications?.filter((n) => !n.viewed)?.map((n) => n.id);
      if (ids?.length > 0) {
        await Promise.all(
          ids.map(async (id) => {
            await dispatch(updateNotificationAsync({
              id: id,
              body: {
                viewed: true,
              }
            }))
          })
        )
        await dispatch(getNotificationsAsync());
      }
    }
    setUpdating(false);
  }

  return (
    <View style={[layoutStyles.screenContainer]}>
      <ScrollView showsVerticalScrollIndicator={false}  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {
          notifications &&
          notifications.length > 0 &&
          notifications.find((n) => !n.viewed) &&
          (
            <View style={[layoutStyles.mt_2]}>
              <Pressable disabled={updating} onPress={markAllAsRead}>
                <CustomText style={[globalStyles.redLink, layoutStyles.mr_1, { textAlign: 'right' }]} >Mark all as read</CustomText>
              </Pressable>
            </View>
          )
        }
        {
          notifications &&
          notifications.length > 0 ?
          notifications
            .slice()
            .sort((a, b) => a.createdAt.valueOf() < b.createdAt.valueOf() ? 1 : -1)
            .map((notification, index) => (
            <NotificationItem
              key={`notification-item-${index}-${notification.id}`}
              notification={notification}
              navigation={navigation}
            />
          )) : (
            <View style={[layoutStyles.m_3]}>
              <CustomText h4>You have no recent notifications.</CustomText>
            </View>
          )
        }
      </ScrollView>
    </View>
  );
};

export default NotificationLanding;