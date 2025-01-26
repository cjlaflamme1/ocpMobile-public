import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomText from '../../components/CustomText';
import { useAppDispatch } from '../../store/hooks';
import inputStyle from '../../styles/componentStyles/inputBar';
import layoutStyles from '../../styles/layout';
import globalStyles from '../../styles/global';
import PrimaryButton from '../../components/PrimaryButton';
import { SignupObject } from '../../models/SignupObject';
import { signUpAsync } from '../../store/authSlice';
import { getCurrentUserAsync } from '../../store/userSlice';
import { NavigationProp } from '@react-navigation/native';
interface Props {
  navigation: NavigationProp<any, any>;
};

const SignIn: React.FC<Props> = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [signupObject, setSignupObject] = useState<SignupObject>();
  const [pwError, setPwError] = useState('');
  const [matchingPW, setMatchingPW] = useState('');
  const [pwMatchError, setPwMatchError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const scrollViewRef = useRef<KeyboardAwareScrollView|null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!signupObject) {
      setSignupObject({
        email: '',
        password: '',
        matchingPw: false,
        firstName: '',
        lastName: '',
        losenord: '',
      });
    }
  }, []);

  const checkValidity = (pw: string) => {
    if (signupObject) {
      if (pw.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/gm)) {
        setSignupObject({ ...signupObject, password: pw });
        setPwError('');
      } else (
        setPwError('Min 8 characters, at least 1 lower case, upper case, number, and special character')
      );
    }
  };

  const checkMatch = () => {
    let submit = true;
    if (signupObject) {
      if (matchingPW !== signupObject.password) {
        setSignupObject({ ...signupObject, matchingPw: false });
        setPwMatchError('Passwords do not match.');
        submit = false;
      } else {
        setSignupObject({ ...signupObject, matchingPw: true });
        setPwMatchError('');
      }
      if (!signupObject.firstName) {
        setFirstNameError('First name is required.');
        submit = false;
      }
      if (!signupObject.lastName) {
        setLastNameError('Last name is required.');
        submit = false;
      }
      if (!signupObject.email) {
        setEmailError('Email is required.');
        submit = false;
      } else if (!signupObject.email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
        setEmailError('Invalid email address.')
        submit = false;
      }
    } else {
      submit = false;
    }
    return submit;
  };

  const submitNewUser = async () => {
    if (
      checkMatch()
      && signupObject
    ) {
      await dispatch(signUpAsync(signupObject))
      dispatch(getCurrentUserAsync());
    }
  };

  if (!signupObject) {
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
            <CustomText h1 bold>Sign Up</CustomText>
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText style={[layoutStyles.mb_1]}>
              First Name
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                value={signupObject?.firstName || ''}
                textContentType='givenName'
                onChangeText={(t) => {
                  if (firstNameError) {
                    setFirstNameError('');
                  }
                  setSignupObject({ ...signupObject, firstName: t})}
                }
                placeholder='First Name'
                autoCorrect={false}
                style={[inputStyle.fullWidthInput]}
              />
            </View>
            {
              firstNameError
              && (
                <View style={[layoutStyles.mt_1]}>
                  <CustomText style={[globalStyles.redLink]}>{firstNameError}</CustomText>
                </View>
              )
            }
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText style={[layoutStyles.mb_1]}>
              Last Name
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                value={signupObject?.lastName || ''}
                textContentType='familyName'
                onChangeText={(t) => {
                  if (lastNameError) {
                    setLastNameError('');
                  }
                  setSignupObject({ ...signupObject, lastName: t})}
                }
                placeholder='Last Name'
                autoCorrect={false}
                style={[inputStyle.fullWidthInput]}
              />
            </View>
            {
              lastNameError
              && (
                <View style={[layoutStyles.mt_1]}>
                  <CustomText style={[globalStyles.redLink]}>{lastNameError}</CustomText>
                </View>
              )
            }
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText style={[layoutStyles.mb_1]}>
              Email
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                value={signupObject?.email || ''}
                onChangeText={(t) => setSignupObject({ ...signupObject, email: t})}
                textContentType='emailAddress'
                placeholder='Enter email'
                autoCorrect={false}
                style={[inputStyle.fullWidthInput]}
              />
            </View>
            {
              emailError
              && (
                <View style={[layoutStyles.mt_1]}>
                  <CustomText style={[globalStyles.redLink]}>{emailError}</CustomText>
                </View>
              )
            }
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText style={[layoutStyles.mb_1]}>
              Password
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
              buttonText='Sign up'
              callback={submitNewUser}
            />
          </View>
          <View style={[layoutStyles.mt_3]}>
            <View
              style={[globalStyles.hr]}
            />
          </View>
          <View style={[layoutStyles.flexRow, layoutStyles.jCenter, layoutStyles.mt_2, layoutStyles.mb_3]}>
            <CustomText>Already have an account? </CustomText>
            <Pressable
              onPress={() => navigation.navigate('SignIn')}
            >
              <CustomText style={[globalStyles.redLink]}>Sign In</CustomText>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
};

export default SignIn;