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
};

const ActivitySettingsSheet: React.FC<Props> = (props) => {
  const {
    customSnapPoints,
    closeSheet,
    bottomSheetRef,
    editProfile,
  } = props;
  

  const snapPoints = useMemo(() => customSnapPoints, [customSnapPoints]);

  const edit = () => {
    closeSheet();
    editProfile();
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
              Edit Activity
            </CustomText>
          </Pressable>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default ActivitySettingsSheet;
