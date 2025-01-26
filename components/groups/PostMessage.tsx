import React, { useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import inputStyle from '../../styles/componentStyles/inputBar';
import layoutStyles from '../../styles/layout';
import CustomText from '../CustomText';
import { CreateGroupPostDto } from '../../store/groupPostSlice';
import { postPresignedUrl, putImageOnS3 } from '../../api/s3API';
import * as ImagePicker from 'expo-image-picker';
import {Buffer} from "buffer";
import { manipulateAsync } from 'expo-image-manipulator';

interface Props {
  placeholderText: string,
  buttonText: string,
  groupId: string,
  handleSubmit: (newPost: CreateGroupPostDto) => void;
};

const PostMessageCard: React.FC<Props> = (props: Props) => {
  const [postContent, setPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset>();
  const [submitting, setSubmitting] = useState(false);
  const {
    placeholderText,
    buttonText,
    groupId,
    handleSubmit,
  } = props;

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

  const clearPost = () => {
    setSelectedImage(undefined);
    setPostContent('');
  }

  const submitPost = async () => {
    setSubmitting(true);
    const newPost: CreateGroupPostDto = {
      groupId: groupId,
      image: '',
      postText: postContent,
    };
    if (selectedImage) {
      let newImage = '';
      if (selectedImage && selectedImage.base64) {
        const imageExt = selectedImage.uri.split('.').pop();
        const imageFileName = `${new Date().valueOf()}-${selectedImage.fileName}`;
        const resizedImage = await manipulateAsync(selectedImage.uri, [{ resize: { width: 700 } }], { base64: true });
        if (!resizedImage.base64) {
          console.log('error');
          return;
        }
        const buff = Buffer.from(resizedImage.base64, "base64");
        const preAuthPostUrl = await postPresignedUrl({ fileName: imageFileName, fileType: `${selectedImage.type}/${imageExt}`, fileDirectory: 'groupPosts'}).then((response) => response).catch((e) => {
          return e;
        });
        if (preAuthPostUrl.status === 201 && preAuthPostUrl.data) {
          await putImageOnS3(preAuthPostUrl.data, buff, `${selectedImage.type}/${imageExt}`).catch((e) => console.log(e));
          newImage = `groupPosts/${imageFileName}`;
        }
      }
      newPost.image = newImage;
    }
    if (newPost.postText || newPost.image) {
      handleSubmit(newPost);
    }
    clearPost();
    setSubmitting(false);
  }

  return (
    <View style={[postMessageStyle.cardContainer]}>
      {
        selectedImage &&
        (
          <View>
            <Image
              source={{ uri: selectedImage.uri }}
              style={[{ width: '100%', height: 150, borderRadius: 25, marginBottom: 10}]}
            />
          </View>
        )
      }
      <View style={[inputStyle.fullWidthInputContainer]}>
        <TextInput
          placeholder={placeholderText}
          style={[inputStyle.fullWidthInput, inputStyle.multilineInput]}
          multiline
          value={postContent}
          onChangeText={(e) => setPostContent(e)}
        />
      </View>
      <View style={[layoutStyles.flexRow, layoutStyles.mt_2]}>
        <View style={[layoutStyles.flexRow, { width: '50%'}, layoutStyles.alignItemCenter]}>
          <Pressable
            onPress={pickImage}
            style={[layoutStyles.mr_2]}
          >
            <Image
              source={require('../../assets/icons/photo.png')}
              style={[{ width: 24, height: 24 }]}
              contentFit='contain'
            />
          </Pressable>
          {/* <Pressable
            onPress={() => console.log('upload icons')}
            style={[layoutStyles.mr_2]}
          >
            <Image
              source={require('../../assets/icons/Group.png')}
              style={[{ width: 24, height: 24, resizeMode: 'contain'}]}
            />
          </Pressable>
          <Pressable
            onPress={() => console.log('upload attachment')}
            style={[layoutStyles.mr_2]}
          >
            <Image
              source={require('../../assets/icons/Vector.png')}
              style={[{ width: 24, height: 24, resizeMode: 'contain'}]}
            />
          </Pressable> */}
        </View>
        <View style={[layoutStyles.dFlex, { width: '50%'}]}>
          <Pressable
            // style={[postMessageStyle.postButton]}
            style={({ pressed }) => {
              if (pressed) {
                return [postMessageStyle.postButton, postMessageStyle.pressed];
              } else {
                return [postMessageStyle.postButton];
              }
            }}
            onPress={submitPost}
            disabled={submitting || !postContent}
          >
            <CustomText bold style={[{ color: 'white' }]}>{buttonText}</CustomText>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default PostMessageCard;

const postMessageStyle = StyleSheet.create({
  postButton: {
    backgroundColor: '#CB1406',
    width: '100%',
    height: 55,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  cardContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 16,
  },
  pressed: {
    backgroundColor: "#e52e20",
  }
});