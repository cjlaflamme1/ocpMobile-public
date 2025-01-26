import React, { useEffect, useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import CustomText from '../../components/CustomText';
import { useAppDispatch } from '../../store/hooks';
import inputStyle from '../../styles/componentStyles/inputBar';
import layoutStyles from '../../styles/layout';
import globalStyles from '../../styles/global';
import PrimaryButton from '../../components/PrimaryButton';
import { SigninObject } from '../../models/SigninObject';
import { requestResetAsync, signInAsync } from '../../store/authSlice';
import { getCurrentUserAsync } from '../../store/userSlice';
import { NavigationProp } from '@react-navigation/native';
interface Props {
  navigation: NavigationProp<any, any>;
};

const SignIn: React.FC<Props> = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [signinError, setSigninError] = useState(false);
  const [disableResetRequest, setDisabledResetRequest] = useState(false);
  const [signinObject, setSigninObject] = useState<SigninObject>()
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!signinObject) {
      setSigninObject({
        email: '',
        password: '',
      })
    }
  }, [])

  const submitLogin = async() => {
    if (signinObject && signinObject.email && signinObject.password) {
      const res = await dispatch(signInAsync(signinObject));
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(getCurrentUserAsync());
        setSigninError(false);
      };
      if (res.meta.requestStatus === 'rejected') {
        setSigninError(true);
      };
    }
  }

  const resetPassword = async () => {
    setDisabledResetRequest(true);
    if (signinObject?.email) {
      const res = await dispatch(requestResetAsync(signinObject.email));
      if (res.meta.requestStatus === 'fulfilled') {
        console.log('redirect to token page');
        navigation.navigate('ResetPW');
      }
    }
    setDisabledResetRequest(false);
  }

  if (!signinObject) {
    return (<View />);
  }
  return (
    <View style={[layoutStyles.screenContainer]}>
      <View style={[layoutStyles.mt_3]}>
        <CustomText h1 bold>Sign In</CustomText>
      </View>
      <View style={[layoutStyles.mt_2]}>
        <CustomText style={[layoutStyles.mb_1]}>
          Email
        </CustomText>
        <View style={[inputStyle.fullWidthInputContainer]}>
          <TextInput
            value={signinObject?.email || ''}
            onChangeText={(t) => setSigninObject({ ...signinObject, email: t})}
            textContentType='emailAddress'
            placeholder='Enter email'
            autoCorrect={false}
            style={[inputStyle.fullWidthInput]}
          />
        </View>
      </View>
      <View style={[layoutStyles.mt_2, layoutStyles.mb_3]}>
        <CustomText style={[layoutStyles.mb_1]}>
          Password
        </CustomText>
        <View style={[inputStyle.fullWidthInputContainer]}>
          <TextInput
            onChangeText={(text) => setSigninObject({ ...signinObject, password: text})}
            autoCorrect={false}
            textContentType='password'
            placeholder='Enter password'
            style={[inputStyle.fullWidthInput]}
            secureTextEntry={passwordVisible}
          />
        </View>
      </View>
      {
        signinError
        && (
          <View style={[layoutStyles.mb_3, layoutStyles.dFlex, layoutStyles.jBetween]}>
            <CustomText style={[layoutStyles.mb_2]}>Invalid email or password.</CustomText>
            <Pressable disabled={disableResetRequest} onPress={resetPassword}>
              <CustomText style={[globalStyles.redLink]}>Request password reset.</CustomText>
            </Pressable>
          </View>
        )
      }
      <View>
        <PrimaryButton
          buttonText='Sign in'
          callback={() => submitLogin()}
        />
      </View>
      <View style={[layoutStyles.mt_3]}>
        <View
          style={[globalStyles.hr]}
        />
      </View>
      <View style={[layoutStyles.flexRow, layoutStyles.jCenter, layoutStyles.mt_2]}>
        <CustomText>Don't have an account? </CustomText>
        <Pressable
          onPress={() => navigation.navigate('SignUp')}
        >
          <CustomText style={[globalStyles.redLink]}>Sign up</CustomText>
        </Pressable>
      </View>
    </View>
  )
};

export default SignIn;