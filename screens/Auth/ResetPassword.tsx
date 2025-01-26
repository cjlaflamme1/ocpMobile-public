import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomText from '../../components/CustomText';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import inputStyle from '../../styles/componentStyles/inputBar';
import layoutStyles from '../../styles/layout';
import globalStyles from '../../styles/global';
import PrimaryButton from '../../components/PrimaryButton';
import { NavigationProp } from '@react-navigation/native';
import { postResetAsync } from '../../store/authSlice';

interface ResetObject {
  email: string;
  token: number;
  password: string;
  matchingPw: boolean;
}

interface Props {
  navigation: NavigationProp<any, any>;
};

const ResetPassword: React.FC<Props> = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [resetObject, setResetObject] = useState<ResetObject>();
  const [pwError, setPwError] = useState('');
  const [matchingPW, setMatchingPW] = useState('');
  const [disableResetRequest, setDisabledResetRequest] = useState(false);
  const [pwMatchError, setPwMatchError] = useState('');
  const scrollViewRef = useRef<KeyboardAwareScrollView|null>(null);
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.authState.resetPass?.email);

  useEffect(() => {
    if (!resetObject) {
      setResetObject({
        email: email || '',
        token: 0,
        password: '',
        matchingPw: false,
      });
    }
  }, []);

  const checkValidity = (pw: string) => {
    if (resetObject) {
      if (pw.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/gm)) {
        setResetObject({ ...resetObject, password: pw });
        setPwError('');
      } else (
        setPwError('Min 8 characters, at least 1 lower case, upper case, number, and special character')
      );
    }
  };

  const checkMatch = () => {
    let submit = true;
    if (resetObject) {
      if (matchingPW !== resetObject.password) {
        setResetObject({ ...resetObject, matchingPw: false });
        setPwMatchError('Passwords do not match.');
        submit = false;
      } else {
        setResetObject({ ...resetObject, matchingPw: true });
        setPwMatchError('');
      }
    } else {
      submit = false;
    }
    return submit;
  };

  const submitReset = async () => {
    setDisabledResetRequest(true);
    if (
      checkMatch()
      && resetObject
    ) {
      // Submit reset token TODO
      const reset = await dispatch(postResetAsync({
        email: resetObject.email,
        password: resetObject.password,
        token: resetObject.token,
      }));
      if (reset.meta.requestStatus === 'fulfilled') {
        navigation.navigate('SignIn');
      }
    }
    setDisabledResetRequest(false);
  };

  if (!resetObject) {
    return <View />;
  }

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
          <View style={[layoutStyles.mt_3]}>
            <CustomText h1 bold>Reset Password</CustomText>
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText style={[layoutStyles.mb_1]}>
              Reset Code
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                keyboardType="numeric"
                onChangeText={(e) => setResetObject({
                  ...resetObject,
                  token: parseInt(e)
                })}
                autoCorrect={false}
                placeholder='Enter token'
                style={[inputStyle.fullWidthInput]}
              />
            </View>
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText style={[layoutStyles.mb_1]}>
              New Password
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                onChangeText={(text) => checkValidity(text)}
                autoCorrect={false}
                textContentType='password'
                placeholder='Enter password'
                style={[inputStyle.fullWidthInput]}
                secureTextEntry={passwordVisible}
              />
            </View>
            {
              pwError
              && (
                <View style={[layoutStyles.mt_1]}>
                  <CustomText style={[globalStyles.redLink]}>{pwError}</CustomText>
                </View>
              )
            }
          </View>
          <View style={[layoutStyles.mt_2, layoutStyles.mb_3]}>
            <CustomText style={[layoutStyles.mb_1]}>
              Re-enter Password
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                onChangeText={(text) => setMatchingPW(text)}
                autoCorrect={false}
                textContentType='password'
                placeholder='Re-enter password'
                style={[inputStyle.fullWidthInput]}
                secureTextEntry={passwordVisible}
              />
            </View>
            {
              pwMatchError
              && (
                <View style={[layoutStyles.mt_1]}>
                  <CustomText style={[globalStyles.redLink]}>{pwMatchError}</CustomText>
                </View>
              )
            }
          </View>
          <View>
            <PrimaryButton
              buttonText='Reset Password'
              callback={submitReset}
              disabled={disableResetRequest}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
};

export default ResetPassword;