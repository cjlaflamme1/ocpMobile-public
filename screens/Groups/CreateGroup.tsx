import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, TextInput, Platform, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import CustomText from '../../components/CustomText';
import * as ImagePicker from 'expo-image-picker';
import {Buffer} from "buffer";
import PrimaryButton from '../../components/PrimaryButton';
import UserIconSmall from '../../components/UserIconSmall';
import inputStyle from '../../styles/componentStyles/inputBar';
import layoutStyles from '../../styles/layout';
import createGroupStyles from '../../styles/screenStyles/groups/createGroup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createGroupAsync, CreateGroupDto, getAllGroupsAsync, getAllUserGroupsAsync } from '../../store/groupSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { postPresignedUrl, putImageOnS3 } from '../../api/s3API';
import { User } from '../../store/userSlice';
import UserSearchDropdown from '../../components/UserSearchDropdown';
import { NavigationProp } from '@react-navigation/native';
import TitleWithBackButton from '../../components/headers/TitleBackButton';
import { manipulateAsync } from 'expo-image-manipulator';

interface Props {
  navigation: NavigationProp<any, any>;
};

const CreateGroup: React.FC<Props> = ({ navigation }) => {
  const [newGroupObj, setNewGroupObj] = useState<CreateGroupDto>();
  const [submitting, setSubmitting] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Partial<User>[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset>();
  const scrollViewRef = useRef<KeyboardAwareScrollView|null>(null);
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.userState.currentUser);

  useEffect(() => {
    if (!newGroupObj) {
      setNewGroupObj({
        coverPhoto: '',
        title: '',
        location: '',
        description: '',
        groupAdminIds: [],
        pendingInvitationUserIds: [],
      });
    }
    const nav = { navigation: navigation, defaultView: 'Groups Landing'}
    navigation.setOptions({
      header: () => (
        <TitleWithBackButton title='Create Group' nav={nav} />
      )
    });
  }, [navigation]);

  if (!currentUser || !newGroupObj) {
    return (<View />);
  }

  const submitNewGroup = async () => {
    setSubmitting(true);
    let newCoverImage = '';
    if (selectedImage && selectedImage.base64) {
      const imageExt = selectedImage.uri.split('.').pop();
      const imageFileName = `${newGroupObj.title}-${selectedImage.fileName}`;
      const resizedImage = await manipulateAsync(selectedImage.uri, [{ resize: { width: 700 } }], { base64: true });
      if (!resizedImage.base64) {
        console.log('error');
        setSubmitting(false);
        return;
      }
      const buff = Buffer.from(resizedImage.base64, "base64");
      const preAuthPostUrl = await postPresignedUrl({ fileName: imageFileName, fileType: `${selectedImage.type}/${imageExt}`, fileDirectory: 'groupImages'}).then((response) => response).catch((e) => {
        return e;
      });
      if (preAuthPostUrl.status === 201 && preAuthPostUrl.data) {
        await putImageOnS3(preAuthPostUrl.data, buff, `${selectedImage.type}/${imageExt}`).catch((e) => console.log(e));
        newCoverImage = `groupImages/${imageFileName}`;
      }
    }
    if (newGroupObj.title && newGroupObj.description) {
      await dispatch(createGroupAsync({
        ...newGroupObj,
        coverPhoto: newCoverImage,
        pendingInvitationUserIds: (selectedUserIds && selectedUserIds.length > 0) ?
          selectedUserIds.map((user) => user.id ? user.id : '') :
          [],
      }));
      dispatch(getAllUserGroupsAsync({
        pagination: {
          take: 25,
          skip: 0,
        }
      }));
      dispatch(getAllGroupsAsync({
        pagination: {
          take: 25,
          skip: 0,
        }
      }));
      setSubmitting(false);
      navigation.navigate('Groups Landing');
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
      quality: Platform.OS === 'ios' ? 0 : .2,
    });
    if ((result.canceled === false) && result.assets.length > 0 && result.assets[0].base64) {
      const currentFile = result.assets[0];
      setSelectedImage(currentFile);
    };
  };

  const { width } = Dimensions.get('window');

  return (
    <View style={[layoutStyles.screenContainer]}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        // onLayout={() => scrollViewRef?.current?.scrollToEnd()}
        // onContentSizeChange={() => scrollViewRef?.current?.scrollToEnd()}
      >
        <View style={[layoutStyles.mb_3]}>
          <View style={[layoutStyles.mt_2]}>
            <CustomText h1 bold>Create Group</CustomText>
          </View>
          {
            selectedImage ?
            (
              <View style={[layoutStyles.mt_2]}>
                <Image
                  source={{uri: selectedImage.uri}}
                  style={[{ width: '100%', height: (width * 0.75), borderRadius: 25}]}
                />
                <Pressable
                    onPress={pickImage}
                    style={[createGroupStyles.editImagePressable]}
                  >
                    <Image
                      source={require("../../assets/icons/CameraWhite.png")}
                      style={[createGroupStyles.editImageIcon]}
                      contentFit='contain'
                    />
                  </Pressable>
              </View>
            ) : (
              <View style={[createGroupStyles.addImageContainer, layoutStyles.mt_3]}>
                <Pressable
                  style={({pressed}) => {
                    if (pressed) {
                      return [createGroupStyles.addImagePressable, createGroupStyles.pressed]
                    } else {
                      return [createGroupStyles.addImagePressable]
                    }
                  }}
                  onPress={pickImage}
                >
                  <Image 
                    source={require('../../assets/icons/Camera.png')}
                    style={[{width: 24, height: 24}]}
                  />
                </Pressable>
              </View>
            )
          }
          <View style={[layoutStyles.mt_2]}>
            <CustomText style={[layoutStyles.mb_1]}>
              Group Name
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                placeholder='Enter group name'
                style={[inputStyle.fullWidthInput]}
                onChangeText={(e) => {
                  setNewGroupObj({
                    ...newGroupObj,
                    title: e,
                  })
                }}
              />
            </View>
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText style={[layoutStyles.mb_1]}>
              Group Location
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                placeholder='Enter general location of group'
                style={[inputStyle.fullWidthInput]}
                onChangeText={(e) => {
                  setNewGroupObj({
                    ...newGroupObj,
                    location: e,
                  })
                }}
              />
            </View>
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText style={[layoutStyles.mb_1]}>
              Group Description
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                placeholder='Enter group description'
                style={[inputStyle.fullWidthInput, inputStyle.multilineInput]}
                multiline
                onChangeText={(e) => {
                  setNewGroupObj({
                    ...newGroupObj,
                    description: e,
                  })
                }}
              />
            </View>
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText style={[layoutStyles.mb_1]}>
              Invite Members
            </CustomText>
            <UserSearchDropdown
              testID='123455'
              testIDDropdown='lkjfsodijfe'
              placeholder='Search for users...'
              setSelected={(e) => {
                setSelectedUserIds([...selectedUserIds, e]);
              }}
              selected={selectedUserIds}
            />
          </View>
          <View style={[layoutStyles.flexRow, { flexWrap: 'wrap'}, layoutStyles.mt_2]}>
            {
              selectedUserIds
              && selectedUserIds.length > 0
              ? selectedUserIds.map((user) => (
                <Pressable key={`selectedUser-${user.id}`}>
                  <UserIconSmall
                    imageSource={{ uri: user.imageGetUrl }}
                    userName={`${user.firstName} ${user.lastName}`}
                  />
                </Pressable>
              )) : (
                <CustomText>No users selected for invite.</CustomText>
              )
            }
          </View>
          <View style={[layoutStyles.mt_3]}>
            <PrimaryButton
              buttonText='Create'
              disabled={!newGroupObj.title || !newGroupObj.description || submitting}
              callback={submitNewGroup}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default CreateGroup;