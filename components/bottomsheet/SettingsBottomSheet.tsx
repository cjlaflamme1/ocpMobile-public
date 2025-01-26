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
  inviteMembers: () => void;
  viewMembers: () => void;
  viewDescription: () => void;
  editGroup: () => void;
  leaveGroup: () => void;
  adminView: boolean;
};

const SettingsSheet: React.FC<Props> = (props) => {
  const {
    customSnapPoints,
    closeSheet,
    bottomSheetRef,
    inviteMembers,
    viewMembers,
    viewDescription,
    editGroup,
    leaveGroup,
    adminView,
  } = props;
  

  const snapPoints = useMemo(() => customSnapPoints, [customSnapPoints]);

  const inviteOthers = () => {
    closeSheet();
    inviteMembers();
  };

  const viewList = () => {
    closeSheet();
    viewMembers();
  };

  const openDescription = () => {
    closeSheet();
    viewDescription();
  };

  const submitEditGroup = () => {
    if (adminView) {
      closeSheet();
      editGroup();
    };
  };

  const submitLeaveGroup = () => {
    closeSheet();
    leaveGroup();
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
            style={[layoutStyles.flexRow,
            layoutStyles.alignItemCenter, { zIndex: 2 }]}
            onPress={() => inviteOthers()}
          >
            <Image
              source={require('../../assets/icons/Plus.png')}
              style={[bottomSheet.itemIcon]}
              contentFit='contain'
            />
            <CustomText>Invite Members</CustomText>
          </Pressable>
        </View>
        <View style={[bottomSheet.itemContainer]}>
          <Pressable
            style={[layoutStyles.flexRow,
            layoutStyles.alignItemCenter, { zIndex: 2 }]}
            onPress={() => viewList()}
          >
            <Image
              source={require('../../assets/icons/GroupBlack.png')}
              style={[bottomSheet.itemIcon]}
              contentFit='contain'
            />
            <CustomText>View Member List</CustomText>
          </Pressable>
        </View>
        <View style={[bottomSheet.itemContainer]}>
          <Pressable
            style={[layoutStyles.flexRow,
            layoutStyles.alignItemCenter, { zIndex: 2 }]}
            onPress={() => openDescription()}
          >
            <Image
              source={require('../../assets/icons/DescriptionBlack.png')}
              style={[bottomSheet.itemIcon]}
              contentFit='contain'
            />
            <CustomText>View Group Description</CustomText>
          </Pressable>
        </View>
        {
          !adminView &&
          (
            <View style={[bottomSheet.itemContainer]}>
              <Pressable
                style={[layoutStyles.flexRow,
                layoutStyles.alignItemCenter, { zIndex: 2 }]}
                onPress={submitLeaveGroup}
              >
                <Image
                  source={require('../../assets/icons/Logout.png')}
                  style={[bottomSheet.itemIcon]}
                  contentFit='contain'
                />
                <CustomText>Leave Group</CustomText>
              </Pressable>
            </View>
          )
        }
        {
          adminView &&
          (
            <View style={[bottomSheet.itemContainer]}>
              <Pressable
                style={[layoutStyles.flexRow,
                layoutStyles.alignItemCenter, { zIndex: 2 }]}
                onPress={() => submitEditGroup()}
              >
                <Image
                  source={require('../../assets/icons/Edit.png')}
                  style={[bottomSheet.itemIcon]}
                  contentFit='contain'
                />
                <CustomText>Edit Group</CustomText>
              </Pressable>
            </View>
            
          )
        }
        {/* {
          adminView &&
          (
            <View style={[bottomSheet.itemContainer]}>
              <Pressable
                style={[layoutStyles.flexRow,
                layoutStyles.alignItemCenter]}
                onPress={() => console.log('TODO: invite admins')}
              >
                <Image
                  source={require('../../assets/icons/Plus.png')}
                  style={[bottomSheet.itemIcon]}
                  contentFit='contain'
                />
                <CustomText>Invite Admins</CustomText>
              </Pressable>
            </View>
            
          )
        } */}
        {/* {
          adminView &&
          (
            <View style={[bottomSheet.itemContainer]}>
              <Pressable
                style={[layoutStyles.flexRow,
                layoutStyles.alignItemCenter]}
                onPress={() => submitBlockUser()}
              >
                <Image
                  source={require('../../assets/icons/Hide.png')}
                  style={[bottomSheet.itemIcon]}
                />
                <CustomText>Block User</CustomText>
              </Pressable>
            </View>
            
          )
        } */}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default SettingsSheet;