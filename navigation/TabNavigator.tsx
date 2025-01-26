import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileNavigation from './ProfileNavigation';
import GroupsNavigation from './GroupsNavigation';
import SearchNavigation from './SearchNavigation';
import NotificationNavigation from './NotificationNavigation';
import { useAppSelector } from '../store/hooks';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  const numberOfNotifications = useAppSelector((state) => state.notificationState.notificationCount);
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Profile"
        component={ProfileNavigation}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Image
                style={{ width: size, height: size }}
                source={focused ? require("../assets/icons/Profile.png") : require("../assets/icons/ProfileUnfocused.png")}
                contentFit='contain'
              />
            )
          },
          tabBarShowLabel: false,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupsNavigation}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Image
                style={{ width: size, height: size }}
                source={focused ? require("../assets/icons/Groups.png") : require("../assets/icons/GroupsUnfocused.png")}
                contentFit='contain'
              />
            )
          },
          tabBarShowLabel: false,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchNavigation}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Image
                style={{width: size, height: size }}
                source={focused ? require("../assets/icons/Search.png") : require("../assets/icons/SearchUnfocused.png")}
                contentFit='contain'
              />
            )
          },
          tabBarShowLabel: false,
          headerShown: false,
        }}
        
      />
      {/* <Tab.Screen
        name="Calendar Navigation"
        component={CalendarNavigation}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Image
                style={{width: size, height: size, resizeMode: 'contain'}}
                source={focused ? require("../assets/icons/Calendar.png") : require("../assets/icons/CalendarUnfocused.png")}
              />
            )
          },
          tabBarShowLabel: false,
          headerShown: false,
        }}
      /> */}
      <Tab.Screen
        name="notifications"
        component={NotificationNavigation}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <View>
                {
                  numberOfNotifications > 0 &&
                  (
                    <View style={[{ height: 10, width: 10, backgroundColor: '#CB1406', borderRadius: 50, position: 'absolute', top: -5, zIndex: 2 }]}>
                    </View>
                  )
                }
                <Image
                  style={{ width: size, height: size }}
                  source={focused ? require("../assets/icons/NotificationFocused.png") : require("../assets/icons/Notification.png")}
                  contentFit='contain'
                />
              </View>
            )
          },
          tabBarShowLabel: false,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  )
};

export default TabNavigator;