import React, { useEffect, useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { RefreshControl, ScrollView, View } from 'react-native';
import CustomText from '../../components/CustomText';
import layoutStyles from '../../styles/layout';
import PrimaryButton from '../../components/PrimaryButton';
import registerForPushNotificationsAsync from '../../services/pushNotifications';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateCurrentUserAsync } from '../../store/userSlice';
import TitleWithBackButton from '../../components/headers/TitleBackButton';

interface Props {
  navigation: NavigationProp<any, any>
};

const NotificationSettings: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState('');
  const [askAgain, setAskAgain] = useState<boolean>();
  const [isGranted, setIsGranted] = useState<boolean>();

  const dispatch = useAppDispatch();
  const pushRegistrationText = useAppSelector((state) => state.userState.currentUser?.expoPushToken);
  const currentUserId = useAppSelector((state) => state.userState.currentUser?.id);

  const pushNotificationStatus = async () => {
    const res = await Notifications.getPermissionsAsync();
    setNotificationStatus(res?.status);
    setAskAgain(res?.canAskAgain);
    setIsGranted(res?.granted);
  }

  useEffect(() => {
    const nav = { navigation: navigation, defaultView: 'Profile Landing'}
    navigation.setOptions({
      header: () => (
        <TitleWithBackButton title='Edit Notifications' nav={nav} />
      )
    });
  }, [navigation]);

  pushNotificationStatus()

  const registerPush = async () => {
    const res = await registerForPushNotificationsAsync()
    if (currentUserId && res && res !== pushRegistrationText) {
      dispatch(updateCurrentUserAsync({
        id: currentUserId,
        updateBody: {
          expoPushToken: res,
        },
      }));
    } else {
      alert('Push notification registration failed. Please check your system settings.')
    }
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await pushNotificationStatus();
    setRefreshing(false);
  };

  return (
    <View style={[layoutStyles.screenContainer]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={[layoutStyles.mt_2, layoutStyles.mb_2]}>
          <CustomText h1 bold>Status: {notificationStatus}</CustomText>
          {
            !askAgain && (
              <View style={[layoutStyles.mt_2, layoutStyles.mb_2]}>
                <CustomText h2>Notifications must be activated in system settings.</CustomText>
              </View>
            )
          }
          <View style={[layoutStyles.mt_2, layoutStyles.mb_2]}>
            {
              (!isGranted || !pushRegistrationText) && (
                <PrimaryButton disabled={!askAgain} buttonText='Allow Push Notifications' callback={registerPush} />
              )
            }
            {
              isGranted && pushRegistrationText && (
                <View>
                    <PrimaryButton buttonText='Push Notifications Registered' disabled outline callback={() => null} />
                    <CustomText style={[layoutStyles.mt_1]} h3>To deactivate, please visit your system settings.</CustomText>
                </View>
              )
            }
          </View>
        </View>
      </ScrollView>
    </View>
  )
};

export default NotificationSettings;
