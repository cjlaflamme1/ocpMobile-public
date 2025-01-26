import React, { useEffect, useState } from 'react';
import { View, Pressable, TextInput, StyleSheet } from 'react-native';
import inputStyle from '../../styles/componentStyles/inputBar';
import layoutStyles from '../../styles/layout';
import CustomText from '../CustomText';
import { NavigationProp } from '@react-navigation/native';

interface Props {
  placeholderText: string,
  buttonText: string,
  handleSubmit: (newPost: string) => Promise<boolean>;
  navigation: NavigationProp<any, any>;
};

const CommentResponse: React.FC<Props> = (props: Props) => {
  const [postContent, setPostContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const {
    placeholderText,
    buttonText,
    handleSubmit,
    navigation
  } = props;

  const clearPost = () => {
    setPostContent('');
  }

  useEffect(() => {
    return () => {
      clearPost();
    }
  }, [navigation])

  const submitPost = async () => {
    setSubmitting(true);
    const success = await handleSubmit(postContent);
    if (success) {
      clearPost();
    }
    setSubmitting(false);
  }


  return (
    <View style={[postMessageStyle.cardContainer]}>
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
        <View style={[layoutStyles.dFlex, { width: '50%'}]}>
          <Pressable
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

export default CommentResponse;

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