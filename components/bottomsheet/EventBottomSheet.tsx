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
  quitEvent: () => void;
  joinEvent: () => void;
  editEvent: () => void;
  cancelEvent: () => void;
  creatorView: boolean;
  attending: boolean;
  expiredEvent: boolean;
};

const EventBottomSheet: React.FC<Props> = (props) => {
  const {
    customSnapPoints,
    closeSheet,
    quitEvent,
    joinEvent,
    editEvent,
    cancelEvent,
    bottomSheetRef,
    creatorView,
    attending,
    expiredEvent,
  } = props;
  

  const snapPoints = useMemo(() => customSnapPoints, [customSnapPoints]);

  const onLeaveClick = () => {
    closeSheet();
    quitEvent();
  };

  const onJoinClick = () => {
    closeSheet();
    joinEvent();
  };

  const onEditClick = () => {
    if (creatorView) {
      closeSheet();
      editEvent();
    }
  };

  const onCancelClick = () => {
    if (creatorView) {
      closeSheet();
      cancelEvent();
    }
  };

  if (expiredEvent) {
    return <View />;
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
    >
      <BottomSheetScrollView contentContainerStyle={[bottomSheet.scrollView]}>
        {/* <View style={[bottomSheet.itemContainer]}>
          <Pressable
            style={[layoutStyles.flexRow,
            layoutStyles.alignItemCenter]}
            onPress={() => console.log('TODO view attending list')}
          >
            <Image
              source={require('../../assets/icons/GroupBlack.png')}
              style={[bottomSheet.itemIcon]}
            />
            <CustomText>View Attending List</CustomText>
          </Pressable>
        </View> */}
        {
          !creatorView &&
          attending &&
          (
            <View style={[bottomSheet.itemContainer]}>
              <Pressable
                style={[layoutStyles.flexRow,
                layoutStyles.alignItemCenter,
                { zIndex: 2 }]}
                onPress={onLeaveClick}
              >
                <Image
                  source={require('../../assets/icons/Plus.png')}
                  style={[bottomSheet.itemIcon]}
                  contentFit='contain'
                />
                <CustomText>Quit Event</CustomText>
              </Pressable>
            </View>
          )
        }
        {
          !creatorView &&
          !attending &&
          (
            <View style={[bottomSheet.itemContainer]}>
              <Pressable
                style={[layoutStyles.flexRow,
                layoutStyles.alignItemCenter, { zIndex: 2 }]}
                onPress={onJoinClick}
              >
                <Image
                  source={require('../../assets/icons/Plus.png')}
                  style={[bottomSheet.itemIcon]}
                  contentFit='contain'
                />
                <CustomText>Join Event</CustomText>
              </Pressable>
            </View>
          )
        }
        {
          creatorView &&
          (
            <View style={[bottomSheet.itemContainer]}>
              <Pressable
                style={[layoutStyles.flexRow,
                layoutStyles.alignItemCenter, { zIndex: 2 }]}
                onPress={onEditClick}
              >
                <Image
                  source={require('../../assets/icons/Logout.png')}
                  style={[bottomSheet.itemIcon]}
                  contentFit='contain'
                />
                <CustomText>Edit Event</CustomText>
              </Pressable>
            </View>
          )
        }
        {
          creatorView &&
          (
            <View style={[bottomSheet.itemContainer]}>
              <Pressable
                style={[layoutStyles.flexRow,
                layoutStyles.alignItemCenter, { zIndex: 2 }]}
                onPress={onCancelClick}
              >
                <Image
                  source={require('../../assets/icons/Edit.png')}
                  style={[bottomSheet.itemIcon]}
                  contentFit='contain'
                />
                <CustomText>Cancel Event</CustomText>
              </Pressable>
            </View>
          )
        }
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default EventBottomSheet;