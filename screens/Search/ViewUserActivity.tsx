import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import layoutStyles from '../../styles/layout';
import { NavigationProp } from '@react-navigation/native';
import CustomText from '../../components/CustomText';
import { clearSelectedUserActivity, getOneUserActivityAsync } from '../../store/userActivitySlice';
import TitleWithBackButton from '../../components/headers/TitleBackButton';

interface Props {
  navigation: NavigationProp<any, any>;
  route: any;
};

const ViewUserActivity: React.FC<Props> = ({ navigation, route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useAppDispatch();
  const selectedUserActivity = useAppSelector((state) => state.userActivityState.selectedUserActivity);
  const userActivityId = route.params.userActivityId;

  useEffect(() => {
    const nav = { navigation: navigation, defaultView: 'Search Landing'}
    dispatch(getOneUserActivityAsync(userActivityId));
    navigation.setOptions({
      header: () => (
        <TitleWithBackButton title='View User' nav={nav}  />
      )
    });
    return () => {
      dispatch(clearSelectedUserActivity());
    }
  }, [userActivityId]);

  const { width } = Dimensions.get('window');

  if (!selectedUserActivity) {
    return (<View />);
  }

  return (
    <View style={[layoutStyles.screenContainer]}>
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} />}>
        <View style={[layoutStyles.mb_3]}>
          <View style={[layoutStyles.mt_2]}>
            {
              selectedUserActivity.getImageUrl && (
                <Image
                  source={{ uri: selectedUserActivity.getImageUrl }}
                  style={[{ width: '100%', height: (width * 0.75), borderRadius: 25}]}
                />
              )
            }
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText h1 bold>
              {selectedUserActivity.activityName || 'Activity type not named.'}
            </CustomText>
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText bold h4 style={[layoutStyles.mb_1]}>
              Information
            </CustomText>
            <CustomText>
              {selectedUserActivity.information}
            </CustomText>
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText bold h4 style={[layoutStyles.mb_1]}>
              Favorite Locations
            </CustomText>
            <CustomText>{selectedUserActivity.favoriteLocations}</CustomText>
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText bold h4 style={[layoutStyles.mb_1]}>
              Years Participating
            </CustomText>
            <CustomText>
              {selectedUserActivity.yearsParticipating}
            </CustomText>
          </View>
            {
              selectedUserActivity.seekingMentor && (
                <View style={[layoutStyles.mt_2]}>
                  <CustomText bold h4 style={[layoutStyles.mb_1]}>
                    Mentorship Needs
                  </CustomText>
                  <CustomText>
                    {selectedUserActivity.mentorNeedsDetails}
                  </CustomText>
                </View>
              )
            }
            {
              selectedUserActivity.offeringMentorship && (
                <View style={[layoutStyles.mt_2]}>
                  <CustomText bold h4 style={[layoutStyles.mb_1]}>
                    Mentorship Availability
                  </CustomText>
                  <CustomText>
                    {selectedUserActivity.provideMentorshipDetails}
                  </CustomText>
                </View>
              )
            }
          </View>
      </ScrollView>
    </View>
  );
};

export default ViewUserActivity;