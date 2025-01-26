import React, { useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import layoutStyles from '../../styles/layout';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import CustomText from '../CustomText';
import bottomSheet from '../../styles/componentStyles/bottomSheet';

interface Props {
  customSnapPoints: number[] | string[];
  bottomSheetRef: React.RefObject<any>;
  closeSheet: () => void;
  editProfile: () => void;
  logout: () => void;
  accountDelete: () => void;
  notificationPress: () => void;
};

const ProfileSettingsSheet: React.FC<Props> = (props) => {
  const {
    customSnapPoints,
    closeSheet,
    bottomSheetRef,
    editProfile,
    logout,
    accountDelete,
    notificationPress,
  } = props;
  

  const snapPoints = useMemo(() => customSnapPoints, [customSnapPoints]);

  const edit = () => {
    closeSheet();
    editProfile();
  };

  const logoutPress = () => {
    closeSheet();
    logout();
  };

  const notifications = () => {
    notificationPress();
    closeSheet();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
    >
      <BottomSheetScrollView contentContainerStyle={[bottomSheet.scrollView]}>
        <View style={[bottomSheet.itemContainer]}>
          <Pressable
            style={[layoutStyles.flexRow, layoutStyles.alignItemCenter, { zIndex: 2 }]}
            onPress={() => edit()}
          >
            <Image
              source={require('../../assets/icons/Edit.png')}
              style={[{ height: 16, width: 16 }, layoutStyles.mr_1]}
              contentFit='contain'
            />
            <CustomText>
              Edit Profile
            </CustomText>
          </Pressable>
        </View>
        <View style={[bottomSheet.itemContainer]}>
          <Pressable
            style={[layoutStyles.flexRow, layoutStyles.alignItemCenter, { zIndex: 2 }]}
            onPress={() => notifications()}
          >
            <Image
              source={require('../../assets/icons/Setting.png')}
              style={[{ height: 16, width: 16 }, layoutStyles.mr_1]}
              contentFit='contain'
            />
            <CustomText>
              Edit Notifications
            </CustomText>
          </Pressable>
        </View>
        <View style={[bottomSheet.itemContainer]}>
          <Pressable
            style={[layoutStyles.flexRow, layoutStyles.alignItemCenter, { zIndex: 2 }]}
            onPress={() => logoutPress()}
          >
            <Image
              source={require('../../assets/icons/Logout.png')}
              style={[{ height: 16, width: 16 }, layoutStyles.mr_1]}
              contentFit='contain'
            />
            <CustomText>
              Logout
            </CustomText>
          </Pressable>
        </View>
        <View style={[bottomSheet.itemContainer]}>
          <Pressable
            style={[layoutStyles.flexRow, layoutStyles.alignItemCenter, { zIndex: 2 }]}
            onPress={() => accountDelete()}
          >
            <Image
              source={require('../../assets/icons/Delete.png')}
              style={[{ height: 16, width: 16 }, layoutStyles.mr_1]}
              contentFit='contain'
            />
            <CustomText>
              Request Account Deletion
            </CustomText>
          </Pressable>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default ProfileSettingsSheet;
