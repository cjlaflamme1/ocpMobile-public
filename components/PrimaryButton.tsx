import React from 'react';
import { Pressable, ViewStyle, StyleProp } from 'react-native';
import CustomText from './CustomText';

interface Props {
  buttonText: string,
  callback: Function,
  outline?: boolean,
  disabled?: boolean,
  styles?: StyleProp<ViewStyle>,
};

const PrimaryButton: React.FC<Props> = (props: Props) => {
  const {
    buttonText,
    callback,
    outline,
    disabled,
    styles,
  } = props;

  if (outline) {
    return (
      <Pressable
        // style={[inputStyle.primaryButton, inputStyle.outlineButton]}
        disabled={disabled}
        style={({ pressed }) => {
          if (pressed) {
            return [inputStyle.primaryButton, inputStyle.outlineButton, inputStyle.pressed, styles];
          } else {
            return [inputStyle.primaryButton, inputStyle.outlineButton, styles];
          }
        }}
        onPress={() => callback()}
      >
        <CustomText bold style={[{ color: '#CB1406' }]}>{buttonText}</CustomText>
      </Pressable>
    )
  }
  return (
    <Pressable
      // style={[inputStyle.primaryButton]}
      disabled={disabled}
      style={({ pressed }) => {
        if (pressed) {
          return [inputStyle.primaryButton, inputStyle.pressed, styles];
        } else {
          return [inputStyle.primaryButton, styles];
        }
      }}
      onPress={() => callback()}
    >
      <CustomText bold style={[{ color: 'white' }]}>{buttonText}</CustomText>
    </Pressable>
  );
};

export default PrimaryButton;

PrimaryButton.defaultProps = {
  outline: false,
  disabled: false,
  styles: undefined,
}

import { StyleSheet } from 'react-native';

const inputStyle = StyleSheet.create({
  primaryButton: {
    backgroundColor: '#CB1406',
    width: '100%',
    height: 55,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  outlineButton: {
    backgroundColor: '#FAFAFA',
    borderColor: '#CB1406',
    borderWidth: 1,
  },
  pressed: {
    backgroundColor: "#e52e20",
  }
});