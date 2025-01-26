import React from 'react';
import { View, Modal, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import CustomText from '../CustomText';
import PrimaryButton from '../PrimaryButton';
import layoutStyles from '../../styles/layout';

interface Props {
  isVisible: boolean;
  closeModal: () => void;
  confirmDelete: () => void;
};

const RequestDeleteModal: React.FC<Props> = (props: Props) => {
  const {
    isVisible,
    closeModal,
    confirmDelete,
  } = props;

  const onAccept = () => {
    confirmDelete();
    closeModal();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <View style={[modalStyle.centeredView]}>
        <View style={[modalStyle.modalView]}>
          <Pressable style={[{ position: 'absolute', right: 20, top: 20}]} onPress={closeModal}>
            <Image
              source={require('../../assets/icons/Close-Square.png')}
              style={[{ height: 24, width: 24 }]}
              contentFit='contain'
            />
          </Pressable>
          <ScrollView>
            <View style={[layoutStyles.mb_3]}>
                <CustomText>Press the 'Request Deletion' button below to submit your request. An email will be sent to your account to confirm the request has been received. Within 30 days, your account and related data will be deleted and a confirmation will be sent to the email on file.</CustomText>
                <CustomText style={[layoutStyles.mt_2]}>Are you sure you would like to delete your account? This cannot be undone.</CustomText>
            </View>
          </ScrollView>
          <PrimaryButton styles={[{ minWidth: '100%'}]} buttonText='Request Deletion' callback={onAccept} />
          <PrimaryButton outline styles={[{ minWidth: '100%'}, layoutStyles.mt_2]} buttonText='Cancel' callback={closeModal} />
        </View>
      </View>
    </Modal>
  );
};

export default RequestDeleteModal;

const modalStyle = StyleSheet.create({
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
    width: '90%',
    maxHeight: '90%',
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