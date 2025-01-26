import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl, Pressable, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import globalStyles from '../../styles/global';
import layoutStyles from '../../styles/layout';
import { NavigationProp } from '@react-navigation/native';
import { clearSelectedUser, getOneUserAsync } from '../../store/userSlice';
import CustomText from '../../components/CustomText';
import profileLandingStyles from '../../styles/screenStyles/profileLanding';
import imageStyles from '../../styles/images';
import ProfileActivityCard from '../../components/ProfileActivityCard';
import TitleWithBackButton from '../../components/headers/TitleBackButton';
import { selectDefaultImage } from '../../services/defaultImage';

interface Props {
  navigation: NavigationProp<any, any>;
  route: any;
};

const ViewUser: React.FC<Props> = ({ navigation, route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.userState.selectedUser);
  const userId = route.params.userId;

  useEffect(() => {
    const nav = { navigation: navigation, defaultView: 'Search Landing'}
    dispatch(getOneUserAsync(userId));
    navigation.setOptions({
      header: () => (
        <TitleWithBackButton title='View User' nav={nav}  />
      )
    });
    return () => {
      dispatch(clearSelectedUser());
    }
  }, [userId]);

  if (!currentUser) {
    return (<View />);
  }

  const viewUserActivity = (id: string): void => {
    navigation.navigate('group-view-user-activity', { userActivityId: id })
  }

  return (
    <View style={[layoutStyles.screenContainer]}>
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} />}>
        <View style={[layoutStyles.m_1, layoutStyles.mt_3, layoutStyles.mb_3]}>
            <View style={[imageStyles.profileImageContainer]}>
              <View>
                <Image
                  source={
                    currentUser.imageGetUrl ?
                      { uri: currentUser.imageGetUrl }
                      : require("../../assets/150x150.png")
                  }
                  style={[imageStyles.profileImage]}
                />
              </View>
            </View>
            <View>
              <CustomText h2 bold center>
                {`${currentUser.firstName} ${currentUser.lastName}`}
              </CustomText>
              <View style={[layoutStyles.flexRow, layoutStyles.jCenter, layoutStyles.m_1]}>
                <Image 
                  source={require('../../assets/icons/location.png')}
                  style={[{width: 16, height: 16, alignSelf: 'center'}]}
                />
                <CustomText style={[globalStyles.mutedText]}>{currentUser.location || 'Edit profile to add location'}</CustomText>
              </View>
            </View>
          </View>
          <View>
          <View style={[layoutStyles.flexRow, layoutStyles.jBetween]}>
            <CustomText h4 bold>User Activities</CustomText>
          </View>
          <View style={[profileLandingStyles.cardRow]}>
            {
              currentUser.activities &&
              currentUser.activities.length > 0 &&
              currentUser.activities.map((activity) => (
                <View key={activity.id} style={[profileLandingStyles.cardColumn]}>
                  <Pressable onPress={() => viewUserActivity(activity.id)}>
                    <ProfileActivityCard
                      imageSource={
                        activity.getImageUrl ?
                          { uri: activity.getImageUrl } :
                          selectDefaultImage(activity.activityName)
                      }
                    >
                      {activity.activityName || 'No Activity Name'}
                    </ProfileActivityCard>
                  </Pressable>
                </View>
              ))
            }
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ViewUser;