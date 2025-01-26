import React from 'react';
import { View, Modal, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { NavigationProp } from '@react-navigation/native';
import bottomSheet from '../../../styles/componentStyles/bottomSheet';
import layoutStyles from '../../../styles/layout';
import CustomText from '../../CustomText';

interface Props {
  isVisible: boolean;
  closeModal: () => void;
  quitEvent: () => void;
  joinEvent: () => void;
  editEvent: () => void;
  cancelEvent: () => void;
  creatorView: boolean;
  attending: boolean;
  expiredEvent: boolean;
};

const EventSettings: React.FC<Props> = (props: Props) => {
  const {
    isVisible,
    closeModal,
    quitEvent,
    joinEvent,
    editEvent,
    cancelEvent,
    creatorView,
    attending,
    expiredEvent,
  } = props;

  const onLeaveClick = () => {
    closeModal();
    quitEvent();
  };

  const onJoinClick = () => {
    closeModal();
    joinEvent();
  };

  const onEditClick = () => {
    if (creatorView) {
      closeModal();
      editEvent();
    }
  };

  const onCancelClick = () => {
    if (creatorView) {
      closeModal();
      cancelEvent();
    }
  };

  if (expiredEvent) {
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
                source={require('../../../assets/icons/Close-Square.png')}
                style={[{ height: 24, width: 24 }]}
                contentFit='contain'
              />
            </Pressable>
            <View style={[{ maxHeight: '90%', paddingTop: 20, paddingBottom: 20, marginTop: 10, marginBottom: 10, }]}>
              <CustomText>This event has expired.</CustomText>
            </View>
          </View>
        </View>
      </Modal>
    );
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
              source={require('../../../assets/icons/Close-Square.png')}
              style={[{ height: 24, width: 24 }]}
              contentFit='contain'
            />
          </Pressable>
          <View style={[{ maxHeight: '90%', paddingTop: 20, paddingBottom: 20 }]}>
            <ScrollView>
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
                        source={require('../../../assets/icons/Plus.png')}
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
                        source={require('../../../assets/icons/Plus.png')}
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
                        source={require('../../../assets/icons/Logout.png')}
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
                        source={require('../../../assets/icons/Edit.png')}
                        style={[bottomSheet.itemIcon]}
                        contentFit='contain'
                      />
                      <CustomText>Cancel Event</CustomText>
                    </Pressable>
                  </View>
                )
              }
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EventSettings;

const modalStyle = StyleSheet.create({
  userListItem: {
    display: 'flex',
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center'
  },
  cardContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 16,
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
    width: '90%'
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