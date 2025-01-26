import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import globalStyles from '../styles/global';
import NotificationLanding from '../screens/Notifications/NotificationLanding';
import TitleOnly from '../components/headers/TitleOnly';



const NotificationNavigation: React.FC = () => {
  const RootStack = createNativeStackNavigator();

  return (
    <>
      <RootStack.Navigator initialRouteName="Notification Landing" >
        <RootStack.Screen
          name="Notification Landing"
          component={NotificationLanding}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
              header: () => (
                <TitleOnly title='Notifications' />
              )
            }
          }
        />
      </RootStack.Navigator >
    </>
  );
}
export default NotificationNavigation;