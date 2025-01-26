import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, TextInput, Platform, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import CustomText from '../../components/CustomText';
import * as ImagePicker from 'expo-image-picker';
import {Buffer} from "buffer";
import PrimaryButton from '../../components/PrimaryButton';
import inputStyle from '../../styles/componentStyles/inputBar';
import layoutStyles from '../../styles/layout';
import createGroupStyles from '../../styles/screenStyles/groups/createGroup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getOneGroupAsync, updateGroupAsync, UpdateGroupDto } from '../../store/groupSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { postPresignedUrl, putImageOnS3 } from '../../api/s3API';
import { NavigationProp } from '@react-navigation/native';
import TitleWithBackButton from '../../components/headers/TitleBackButton';
import { manipulateAsync } from 'expo-image-manipulator';

interface Props {
  navigation: NavigationProp<any, any>;
  route: any;
};

const EditGroup: React.FC<Props> = ({ navigation, route }) => {
  const [groupObj, setGroupObj] = useState<UpdateGroupDto>();
  const [updating, setUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset>();
  const scrollViewRef = useRef<KeyboardAwareScrollView|null>(null);
  const dispatch = useAppDispatch();
  const groupId = route.params.groupId;

  const currentUser = useAppSelector((state) => state.userState);

  useEffect(() => {
    if (!groupObj || groupObj.id !== groupId) {
      dispatch((getOneGroupAsync(groupId))).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          const currGroup = res.payload;
          setGroupObj(currGroup);
        }
      })
    }
    if (!groupObj) {
      setGroupObj({
        coverPhoto: '',
        title: '',
        location: '',
        description: '',
        addingAdminIds: [],
        addingUserIds: [],
      });
    }
    const nav = { navigation: navigation, defaultView: 'Groups Landing'}
    navigation.setOptions({
      header: () => (
        <TitleWithBackButton title='Edit Group' nav={nav} />
      )
    });
  }, [navigation, groupId]);

  if (!currentUser || !groupObj) {
    return (<View />);
  }

  const updateGroup = async () => {
    setUpdating(true);
    let newCoverImage = groupObj.coverPhoto || '';
    if (selectedImage && selectedImage.base64) {
      const imageExt = selectedImage.uri.split('.').pop();
      const imageFileName = `${groupObj.title}-${selectedImage.fileName}`;
      const resizedImage = await manipulateAsync(selectedImage.uri, [{ resize: { width: 700 } }], { base64: true });
      if (!resizedImage.base64) {
        console.log('error');
        setUpdating(false);
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
    if (groupObj.title && groupObj.description) {
      await dispatch(updateGroupAsync({
        id: groupId,
        body: {
          title: groupObj.title,
          description: groupObj.description,
          location: groupObj.location,
          coverPhoto: newCoverImage,
        }
      }));
      dispatch(getOneGroupAsync(groupId));
      navigation.goBack();
    }
    setUpdating(false);
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
            <CustomText h1 bold>Update Group</CustomText>
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
                defaultValue={groupObj.title}
                style={[inputStyle.fullWidthInput]}
                onChangeText={(e) => {
                  setGroupObj({
                    ...groupObj,
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
                defaultValue={groupObj.location}
                style={[inputStyle.fullWidthInput]}
                onChangeText={(e) => {
                  setGroupObj({
                    ...groupObj,
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
                defaultValue={groupObj.description}
                style={[inputStyle.fullWidthInput, inputStyle.multilineInput]}
                multiline
                onChangeText={(e) => {
                  setGroupObj({
                    ...groupObj,
                    description: e,
                  })
                }}
              />
            </View>
          </View>
          <View style={[layoutStyles.mt_3]}>
            <PrimaryButton
              buttonText='Update'
              disabled={!groupObj.title || !groupObj.description || updating}
              callback={() => updateGroup()}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default EditGroup;