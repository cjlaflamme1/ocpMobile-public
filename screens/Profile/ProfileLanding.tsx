import React, { useEffect, useRef, useState } from 'react';
import { View, RefreshControl, Pressable, TextInput, Platform } from 'react-native';
import { Image } from 'expo-image';
import ProfileActivityCard from '../../components/ProfileActivityCard';
import CustomText from '../../components/CustomText';
import globalStyles from '../../styles/global';
import imageStyles from '../../styles/images';
import layoutStyles from '../../styles/layout';
import profileLandingStyles from '../../styles/screenStyles/profileLanding';
import { logoutAction } from '../../store/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import * as ImagePicker from 'expo-image-picker';
import {Buffer} from "buffer";
import { postPresignedUrl, putImageOnS3 } from '../../api/s3API';
import { getCurrentUserAsync, requestDeleteUserAsync, updateCurrentUserAsync } from '../../store/userSlice';
import { NavigationProp } from '@react-navigation/native';
import inputStyle from '../../styles/componentStyles/inputBar';
import { getOneUserActivityAsync, getUserActivitiesAsync } from '../../store/userActivitySlice';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getNotificationsAsync } from '../../store/notificationSlice';
import ProfileSettingsSheet from '../../components/bottomsheet/ProfileSettingsSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import TitleAndAction from '../../components/headers/TitleAndAction';
import PrimaryButton from '../../components/PrimaryButton';
import { selectDefaultImage } from '../../services/defaultImage';
import { manipulateAsync } from 'expo-image-manipulator';
import RequestDeleteModal from '../../components/modals/RequestDeleteModal';
import ProfileSettings from '../../components/bottomsheet/androidModals/ProfileSettings';

interface Props {
  navigation: NavigationProp<any, any>
};

const ProfileLanding: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [androidModal, setAndroidModal] = useState(false);
  const [debounceHandle, setDebounceHandle] = useState<any>();
  const [debounceFNHandle, setDebounceFNHandle] = useState<any>();
  const scrollViewRef = useRef<KeyboardAwareScrollView|null>(null);
  const [debounceLNHandle, setDebounceLNHandle] = useState<any>();
  const dispatch = useAppDispatch();
  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh functions here
      await dispatch(getCurrentUserAsync());
      await dispatch(getUserActivitiesAsync());
    setRefreshing(false);
  }

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleClosePress = () => bottomSheetRef?.current?.close();

  const handleOpenAndroid = () => {
    setAndroidModal(true);
  };

  const handleOpen = () => {
    bottomSheetRef?.current?.expand();
  };

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <TitleAndAction title='Outdoor Community Project'>
          <Pressable
            style={[layoutStyles.flexRow,
            layoutStyles.alignItemCenter,
            { zIndex: 2 }
          ]}
            onPress={() => {Platform.OS === 'ios' ? handleOpen() : handleOpenAndroid()}}
          >
            <Image
              source={require('../../assets/icons/Setting.png')}
              contentFit='contain'
              style={[{ height: 24, width: 24, resizeMode: 'contain'}, layoutStyles.mr_1, {top: 0, left: 0, position: 'relative'}]}
            />
          </Pressable>
        </TitleAndAction>
      )
    });
    dispatch(getUserActivitiesAsync());
    dispatch(getNotificationsAsync());
  }, [navigation, bottomSheetRef, bottomSheetRef?.current]);

  const currentUser = useAppSelector((state) => state.userState.currentUser);
  const userActivities = useAppSelector((state) => state.userActivityState.userActivities);
  if (!currentUser) {
    return (<View />);
  }

  const updatePersonalBio = (data: string, location: 'location' | 'firstName' | 'lastName') => {
    if (currentUser && location === 'location') {
      dispatch(updateCurrentUserAsync({ id: currentUser.id, updateBody: {
        location: data,
      }}));
    } else if (currentUser && location === 'firstName') {
      dispatch(updateCurrentUserAsync({ id: currentUser.id, updateBody: {
        firstName: data,
      }}));
    } else if (currentUser && location === 'lastName') {
      dispatch(updateCurrentUserAsync({ id: currentUser.id, updateBody: {
        lastName: data,
      }}));
    }
  }

  const updateResolutionDetails = async (resolution: string, location: 'location' | 'firstName' | 'lastName') => {
    if (currentUser && resolution) {
      updatePersonalBio(resolution, location);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [3, 3],
      quality: Platform.OS === 'ios' ? 0 : .2,
    });

    if ((result.canceled === false) && result.assets.length > 0 && result.assets[0].base64) {
      const resizedImage = await manipulateAsync(result.assets[0].uri, [{ resize: { width: 300 } }], { base64: true });
      if (!resizedImage.base64) {
        console.log('error');
        return;
      }
      const imageExt = result.assets[0].uri.split('.').pop();
      const imageFileName = currentUser.id;

      const buff = Buffer.from(resizedImage.base64, "base64");
      const preAuthPostUrl = await postPresignedUrl({ fileName: imageFileName, fileType: `${result.assets[0].type}/${imageExt}`, fileDirectory: 'profileImage'}).then((response) => response).catch((e) => {
        return e;
      });
      if (preAuthPostUrl.status === 201 && preAuthPostUrl.data) {
        await putImageOnS3(preAuthPostUrl.data, buff, `${result.assets[0].type}/${imageExt}`).catch((e) => console.log(e));
        dispatch(updateCurrentUserAsync({ id: currentUser.id, updateBody: {
          profilePhoto: `profileImage/${imageFileName}`,
        }}));
      }
    };
  };

  const viewUserActivity = async (id: string) => {
    const activity = await dispatch(getOneUserActivityAsync(id));
    if (activity && activity.meta.requestStatus === 'fulfilled') {
      navigation.navigate("Activity Description");
    }
  };

  const submitRequestDelete = async () => {
    const req = await dispatch(requestDeleteUserAsync(currentUser.id));
    if (req.meta.requestStatus === 'fulfilled') {
      dispatch(logoutAction());
    }
  }

  return (
    <View style={[layoutStyles.screenContainer]}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        // onLayout={() => scrollViewRef?.current?.scrollToEnd()}
        // onContentSizeChange={() => scrollViewRef?.current?.scrollToEnd()}
      >
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
                contentFit='contain'
              />
              {
                editMode
                && (
                  <Pressable
                    onPress={pickImage}
                    style={[profileLandingStyles.editImagePressable]}
                  >
                    <Image
                      source={require("../../assets/icons/CameraWhite.png")}
                      style={[profileLandingStyles.editImageIcon]}
                      contentFit='contain'
                    />
                  </Pressable>
                )
              }
            </View>
            {
              !editMode
              && (
                <Pressable
                  onPress={() => setEditMode(!editMode)}
                  style={[profileLandingStyles.editProfilePressable]}
                >
                  <Image
                    source={require("../../assets/icons/EditRed.png")}
                    style={[profileLandingStyles.editProfileIcon]}
                    contentFit='contain'
                  />
                  <CustomText style={[globalStyles.redLink]}>Edit Profile</CustomText>
                </Pressable>
              )
            }
          </View>
          {
            editMode
            ? (
              <View>
                <View style={[layoutStyles.mt_2]}>
                  <CustomText style={[layoutStyles.mb_1]}>
                    First Name
                  </CustomText>
                  <View style={[inputStyle.fullWidthInputContainer]}>
                    <TextInput
                      defaultValue={currentUser.firstName || ''}
                      textContentType='givenName'
                      onChangeText={(e) => {
                        if (debounceFNHandle) {
                          clearTimeout(debounceFNHandle);
                        } 
                        const handle = setTimeout(() => updateResolutionDetails(e, 'firstName'), 1000);
                        setDebounceFNHandle(handle);
                      }}
                      placeholder='First Name'
                      autoCorrect={false}
                      style={[inputStyle.fullWidthInput]}
                    />
                  </View>
                </View>
                <View style={[layoutStyles.mt_2]}>
                  <CustomText style={[layoutStyles.mb_1]}>
                    Last Name
                  </CustomText>
                  <View style={[inputStyle.fullWidthInputContainer]}>
                    <TextInput
                      defaultValue={currentUser.lastName || ''}
                      textContentType='familyName'
                      onChangeText={(e) => {
                        if (debounceLNHandle) {
                          clearTimeout(debounceLNHandle);
                        } 
                        const handle = setTimeout(() => updateResolutionDetails(e, 'lastName'), 1000);
                        setDebounceLNHandle(handle);
                      }}
                      placeholder='Last Name'
                      autoCorrect={false}
                      style={[inputStyle.fullWidthInput]}
                    />
                  </View>
                </View>
                <View style={[layoutStyles.mt_2]}>
                  <CustomText style={[layoutStyles.mb_1]}>
                    Location
                  </CustomText>
                  <View style={[inputStyle.fullWidthInputContainer]}>
                    <TextInput
                      defaultValue={currentUser.location || ''}
                      textContentType='addressCityAndState'
                      onChangeText={(e) => {
                        if (debounceHandle) {
                          clearTimeout(debounceHandle);
                        } 
                        const handle = setTimeout(() => updateResolutionDetails(e, 'location'), 1000);
                        setDebounceHandle(handle);
                      }}
                      placeholder='Location (ie: City, State)'
                      autoCorrect={false}
                      style={[inputStyle.fullWidthInput]}
                    />
                  </View>
                </View>
                <View style={[layoutStyles.mt_2]}>
                  <PrimaryButton
                    buttonText='Save Edits'
                    callback={() => setEditMode(false)}
                  />
                </View>
              </View>
            ) : (
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
            )
          }
        </View>
        {
          !editMode
          && (
            <View>
              <View style={[layoutStyles.flexRow, layoutStyles.jBetween]}>
                <CustomText h4 bold>User Activities</CustomText>
                <Pressable onPress={() => navigation.navigate("Create Activity")}>
                  <CustomText style={[globalStyles.redLink]}>+ Add Activity</CustomText>
                </Pressable>
              </View>
              <View style={[profileLandingStyles.cardRow]}>
                {
                  userActivities &&
                  userActivities.length > 0 ?
                  userActivities.map((activity) => (
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
                  )) : (
                    <View style={[profileLandingStyles.cardColumn]}>
                      <Pressable onPress={() => navigation.navigate("Create Activity")}>
                        <ProfileActivityCard imageSource={require('../../assets/profilePhotos/testSportImage.jpg')}>
                          Add activities to your profile!
                        </ProfileActivityCard>
                      </Pressable>
                    </View>
                  )
                }
              </View>
            </View>
          )
        }
      </KeyboardAwareScrollView>
      <RequestDeleteModal
        isVisible={deleteModal}
        closeModal={() => setDeleteModal(false)}
        confirmDelete={submitRequestDelete}
      />
      {
        Platform.OS === 'ios' && (
          <ProfileSettingsSheet
            logout={() => dispatch(logoutAction())}
            closeSheet={() => handleClosePress()}
            bottomSheetRef={bottomSheetRef}
            customSnapPoints={['25%', '50%']}
            editProfile={() => setEditMode(!editMode)}
            accountDelete={() => setDeleteModal(true)}
            notificationPress={() => navigation.navigate('notifications')}
          />
        )
      }
      {
        Platform.OS === 'android' && (
          <ProfileSettings
            isVisible={androidModal}
            closeModal={() => setAndroidModal(false)}
            editProfile={() => setEditMode(!editMode)}
            accountDelete={() => setDeleteModal(true)}
            logout={() => dispatch(logoutAction())}
            notificationPress={() => navigation.navigate('notifications')}
          />
        )
      }
    </View>
  );
};

export default ProfileLanding;