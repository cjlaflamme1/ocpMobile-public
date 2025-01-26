import React from 'react';
import { View, Pressable, StyleSheet, Modal } from 'react-native';
import { Image } from 'expo-image';
import CustomText from '../CustomText';
import layoutStyles from '../../styles/layout';
import { GroupInvitation } from '../../store/groupSlice';
import PrimaryButton from '../PrimaryButton';

interface Props {
  invite: GroupInvitation;
  isVisible: boolean;
  acceptAction: () => void;
  rejectAction: () => void;
  closeModal: () => void;
};

const InviteModal: React.FC<Props> = (props: Props) => {
  const {
    invite,
    isVisible,
    closeModal,
    acceptAction,
    rejectAction,
  } = props;
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}>
      <View style={inviteStyle.centeredView}>
        <View style={inviteStyle.modalView}>
          <Pressable style={[{ position: 'absolute', right: 20, top: 20}]} onPress={closeModal}>
            <Image
              source={require('../../assets/icons/Close-Square.png')}
              style={[{ height: 24, width: 24 }]}
              contentFit='contain'
            />
          </Pressable>
          <View style={[layoutStyles.mb_3]}>
            <View style={[layoutStyles.mt_2]}>
              <Image
                source={ invite.group.imageGetUrl ? {
                  uri: invite.group.imageGetUrl
                } : require('../../assets/300x200.png')}
                style={[{ width: '100%', height: 200, borderRadius: 25}]}
              />
            </View>
            <View style={[layoutStyles.mt_2]}>
              <CustomText h1 bold>
                { invite.group.title }
              </CustomText>
              <CustomText>
                { invite.group.description }
              </CustomText>
            </View>
            <View style={[layoutStyles.mt_2]}>
              <CustomText bold>
                {`Invited by ${invite.invitedBy?.firstName} ${invite.invitedBy?.lastName}`}
              </CustomText>
              <CustomText>
                { invite.message }
              </CustomText>
            </View>
          </View>
          <PrimaryButton styles={[{ minWidth: '100%'}]} buttonText='Accept Invite' callback={acceptAction} />
          <PrimaryButton outline styles={[{ minWidth: '100%'}, layoutStyles.mt_2]} buttonText='Deny Invite' callback={rejectAction} />
        </View>
      </View>
    </Modal>
  );
};

export default InviteModal;

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
    resizeMode: 'contain',
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