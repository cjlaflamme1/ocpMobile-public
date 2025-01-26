import React, { useState } from 'react';
import { View, ImageSourcePropType, Pressable, TextInput, StyleSheet, Modal, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import CustomText from '../CustomText';
import globalStyles from '../../styles/global';
import layoutStyles from '../../styles/layout';
import { Group } from '../../store/groupSlice';
import PrimaryButton from '../PrimaryButton';

interface Props {
  group: Group;
  isVisible: boolean;
  acceptAction: () => void;
  closeModal: () => void;
};

const PreviewGroupModal: React.FC<Props> = (props: Props) => {
  const {
    group,
    isVisible,
    closeModal,
    acceptAction,
  } = props;
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}>
      <View style={[inviteStyle.centeredView]}>
        <View style={inviteStyle.modalView}>
          <Pressable style={[{ position: 'absolute', right: 20, top: 20}]} onPress={closeModal}>
            <Image
              source={require('../../assets/icons/Close-Square.png')}
              style={[{ height: 24, width: 24 }]}
              contentFit='contain'
            />
          </Pressable>
          <ScrollView>
            <View style={[layoutStyles.mb_3]}>
                <View style={[layoutStyles.mt_2]}>
                  <Image
                    source={ group.imageGetUrl ? {
                      uri: group.imageGetUrl
                    } : require('../../assets/300x200.png')}
                    style={[{ width: '100%', height: 200, borderRadius: 25}]}
                  />
                </View>
                <View style={[layoutStyles.mt_2]}>
                  <CustomText h1 bold>
                    { group.title }
                  </CustomText>
                  {
                    group.location && (
                      <View style={[layoutStyles.flexRow, layoutStyles.jStart, layoutStyles.m_1]}>
                        <Image 
                          source={require('../../assets/icons/location.png')}
                          style={[{width: 16, height: 16, alignSelf: 'center'}]}
                        />
                        <CustomText style={[globalStyles.mutedText]}>{group.location}</CustomText>
                      </View>
                    )
                  }
                  <CustomText>
                    { group.description }
                  </CustomText>
                </View>
            </View>
          </ScrollView>
          <PrimaryButton styles={[{ minWidth: '100%'}]} buttonText='Join Group' callback={acceptAction} />
          <PrimaryButton outline styles={[{ minWidth: '100%'}, layoutStyles.mt_2]} buttonText='Close' callback={closeModal} />
        </View>
      </View>
    </Modal>
  );
};

export default PreviewGroupModal;

const inviteStyle = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 16,
  },
  postProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 25,
  },
  iconStyle: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    maxHeight: '90%',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});