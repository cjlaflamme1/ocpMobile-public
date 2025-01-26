import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable } from 'react-native';
import { Image } from 'expo-image';
import GroupsLanding from '../screens/Groups/GroupsLanding';
import globalStyles from '../styles/global';
import CreateGroup from '../screens/Groups/CreateGroup';
import GroupView from '../screens/Groups/GroupView';
import ViewGroupMessage from '../screens/Groups/ViewGroupMessage';
import layoutStyles from '../styles/layout';
import CreateGroupEvent from '../screens/Groups/CreateGroupEvent';
import ViewGroupEvent from '../screens/Groups/ViewGroupEvent';
import EditGroup from '../screens/Groups/EditGroup';
import ViewUser from '../screens/Search/ViewUser';
import ViewUserActivity from '../screens/Search/ViewUserActivity';
import TitleWithBackButton from '../components/headers/TitleBackButton';
import TitleOnly from '../components/headers/TitleOnly';
import TripleHeader from '../components/headers/TripleHeader';
import EditGroupEvent from '../screens/Groups/EditGroupEvent';



const GroupsNavigation: React.FC = () => {
  const RootStack = createNativeStackNavigator();

  return (
    <>
      <RootStack.Navigator initialRouteName="Groups Landing" >
        <RootStack.Screen
          name="Groups Landing"
          component={GroupsLanding}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
              header: () => (
                <TitleOnly title='View Your Groups' />
              )
            }
          }
        />
        <RootStack.Screen
          name="Create Group"
          component={CreateGroup}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
              header: () => (
                <TitleWithBackButton title='Create Group' />
              )
            }
          }
        />
        <RootStack.Screen
          name="Edit Group"
          component={EditGroup}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
              header: () => (
                <TitleWithBackButton title='Edit Group' />
              )
            }
          }
        />
        <RootStack.Screen
          name="View Group"
          component={GroupView}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
              headerTitle: '',
              header: () => (
                <TripleHeader title='View Group'>
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
          name="View Comment"
          component={ViewGroupMessage}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
              header: () => (
                <TitleWithBackButton title='View Message' />
              )
            }
          }
        />
        <RootStack.Screen
          name="Create Group Event"
          component={CreateGroupEvent}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
              header: () => (
                <TitleWithBackButton title='Create Event' />
              )
            }
          }
        />
        <RootStack.Screen
          name="View Group Event"
          component={ViewGroupEvent}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
              header: () => (
                <TitleWithBackButton title='View Event' />
              )
            }
          }
        />
        <RootStack.Screen
          name="Edit Group Event"
          component={EditGroupEvent}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
              header: () => (
                <TitleWithBackButton title='Edit Event' />
              )
            }
          }
        />
        <RootStack.Screen
          name="group-view-user"
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
          name="group-view-user-activity"
          component={ViewUserActivity}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
              header: () => (
                <TitleWithBackButton title='View User' />
              )
            }
          }
        />
      </RootStack.Navigator >
    </>
  );
}
export default GroupsNavigation;