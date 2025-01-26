import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable } from 'react-native';
import { Image } from 'expo-image';
import ProfileLanding from '../screens/Profile/ProfileLanding';
import globalStyles from '../styles/global';
import ActivityDescription from '../screens/Profile/ActivityDescription';
import layoutStyles from '../styles/layout';
import CreateActivity from '../screens/Profile/CreateActivity';
import TitleWithBackButton from '../components/headers/TitleBackButton';
import TitleAndAction from '../components/headers/TitleAndAction';
import TripleHeader from '../components/headers/TripleHeader';
import NotificationSettings from '../screens/Profile/NotificationSettings';



const ProfileNavigation: React.FC = () => {
  const RootStack = createNativeStackNavigator();

  return (
    <>
      <RootStack.Navigator initialRouteName="Profile Landing" >
        <RootStack.Screen
          name="Profile Landing"
          component={ProfileLanding}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
              headerTitle: '',
              header: () => (
                <TitleAndAction title='Outdoor Community Project'>
                  <Pressable style={[layoutStyles.flexRow, layoutStyles.alignItemCenter]}>
                    <Image
                      source={require('../assets/icons/Setting.png')}
                      style={[{ height: 24, width: 24 }, layoutStyles.mr_1]}
                      contentFit='contain'
                    />
                  </Pressable>
                </TitleAndAction>
              )
            }
          }
        />
        <RootStack.Screen
          name="Activity Description"
          component={ActivityDescription}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
              headerTitle: '',
              header: () => (
                <TripleHeader title='Activity Description'>
                  <Pressable style={[layoutStyles.flexRow, layoutStyles.alignItemCenter]}>
                    <Image
                      source={require('../assets/icons/Setting.png')}
                      style={[{ height: 24, width: 24 }, layoutStyles.mr_1]}
                      contentFit='contain'
                    />
                  </Pressable>
                </TripleHeader>
              )
            }
          }
        />
        <RootStack.Screen
          name="Create Activity"
          component={CreateActivity}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
              header: () => (
                <TitleWithBackButton title='Create Activity' />
              )
            }
          }
        />
        <RootStack.Screen
          name="notifications"
          component={NotificationSettings}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
              header: () => (
                <TitleWithBackButton title='Edit Notifications' />
              )
            }
          }
        />
      </RootStack.Navigator >
    </>
  );
}
export default ProfileNavigation;