import React, { useEffect, useRef, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import TabNavigator from './TabNavigator';
import { getCurrentUserAsync, updateCurrentUserAsync } from '../store/userSlice';
import { loginAction } from '../store/authSlice';
import SignIn from '../screens/Auth/SignIn';
import SignUp from '../screens/Auth/SignUp';
import globalStyles from '../styles/global';
import * as Notifications from 'expo-notifications';
import { getNotificationsAsync } from '../store/notificationSlice';
import ResetPassword from '../screens/Auth/ResetPassword';
import { AppState } from 'react-native';

interface Props {
  expoPushToken: string;
}

const RootNavigation: React.FC<Props> = ({ expoPushToken }) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const RootStack = createNativeStackNavigator();
  const dispatch = useAppDispatch();
  const currentAuth = useAppSelector((state) => state.authState.currentAuth);
  const currentUser = useAppSelector((state) => state.userState.currentUser);
  const numberOfNotifications = useAppSelector((state) => state.notificationState.notificationCount);


  const checkUser = async () => {
    try {
      const loginStatus = await dispatch(getCurrentUserAsync());
      if (loginStatus.payload.email) {
        dispatch(loginAction({
          loggedIn: true,
          email: loginStatus.payload.email,
          accessToken: null,
        }));
      }
    } catch (e: any) {
      return e;
    }
  }

  useEffect(() => {
    checkUser();
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (appStateVisible === 'active') {
      dispatch(getNotificationsAsync()).catch((err) => console.error(err));
    }
  }, [appStateVisible]);

  useEffect(() => {
    if (currentUser && expoPushToken) {
      if (currentUser.expoPushToken !== expoPushToken) {
        dispatch(updateCurrentUserAsync({
          id: currentUser.id,
          updateBody: {
            expoPushToken,
          },
        }));
      };
    }
    if (currentUser) {
      dispatch(getNotificationsAsync());
    }
  }, [expoPushToken, currentUser])

  useEffect(() => {
    Notifications.setBadgeCountAsync(numberOfNotifications);
  }, [numberOfNotifications]);

  return (
    <>
      {
        !currentAuth || !currentAuth.loggedIn ? (
          <RootStack.Navigator initialRouteName="SignIn" >
            <RootStack.Screen
              name="SignIn"
              component={SignIn}
              options={
                {
                  contentStyle: globalStyles.navigationStackScreen,
                  title: 'Welcome',
                }
              }
            />
            <RootStack.Screen
              name="SignUp"
              component={SignUp}
              options={
                {
                  contentStyle: globalStyles.navigationStackScreen,
                  title: 'Welcome',
                }
              }
            />
            <RootStack.Screen
              name="ResetPW"
              component={ResetPassword}
              options={
                {
                  contentStyle: globalStyles.navigationStackScreen,
                  title: 'Welcome',
                }
              }
            />
          </RootStack.Navigator >
        ) : (
          <RootStack.Navigator initialRouteName="UserTabNavigator">
            <RootStack.Screen
                name="UserTabNavigator"
                component={TabNavigator}
                options={
                  { headerShown: false,
                    contentStyle: {
                      backgroundColor: '#FAFAFA'
                    }
                  }
                  
                }
              />
          </RootStack.Navigator>
        )
      }
    </>
  );
}
export default RootNavigation;