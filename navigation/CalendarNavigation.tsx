import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CalendarLanding from '../screens/Calendar/CalendarLanding';
import globalStyles from '../styles/global';



const CalendarNavigation: React.FC = () => {
  const RootStack = createNativeStackNavigator();

  return (
    <>
      <RootStack.Navigator initialRouteName="Calendar Landing" >
        <RootStack.Screen
          name="Calendar Landing"
          component={CalendarLanding}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
            }
          }
        />
      </RootStack.Navigator >
    </>
  );
}
export default CalendarNavigation;