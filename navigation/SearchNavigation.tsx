import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchLanding from '../screens/Search/SearchLanding';
import globalStyles from '../styles/global';
import TitleOnly from '../components/headers/TitleOnly';



const SearchNavigation: React.FC = () => {
  const RootStack = createNativeStackNavigator();

  return (
    <>
      <RootStack.Navigator initialRouteName="Search Landing" >
        <RootStack.Screen
          name="Search Landing"
          component={SearchLanding}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
              header: () => (
                <TitleOnly title='Search New Groups' />
              )
            }
          }
        />
        {/* <RootStack.Screen
          name="View User"
          component={ViewUser}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
              header: () => (
                <TitleWithBackButton title='View User' />
              )
            }
          }
        />
        <RootStack.Screen
          name="View User Activity"
          component={ViewUserActivity}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
              header: () => (
                <TitleWithBackButton title='View User' />
              )
            }
          }
        /> */}
      </RootStack.Navigator >
    </>
  );
}
export default SearchNavigation;