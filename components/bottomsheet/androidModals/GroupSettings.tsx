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
  inviteMembers: () => void;
  viewMembers: () => void;
  viewDescription: () => void;
  editGroup: () => void;
  leaveGroup: () => void;
  adminView: boolean;
};

const GroupSettings: React.FC<Props> = (props: Props) => {
  const {
    isVisible,
    closeModal,
    inviteMembers,
    viewMembers,
    viewDescription,
    editGroup,
    leaveGroup,
    adminView,
  } = props;

  const inviteOthers = () => {
    closeModal();
    inviteMembers();
  };

  const viewList = () => {
    closeModal();
    viewMembers();
  };

  const openDescription = () => {
    closeModal();
    viewDescription();
  };

  const submitEditGroup = () => {
    if (adminView) {
      closeModal();
      editGroup();
    };
  };

  const submitLeaveGroup = () => {
    closeModal();
    leaveGroup();
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
              <View style={[bottomSheet.itemContainer]}>
                <Pressable
                  style={[layoutStyles.flexRow,
                  layoutStyles.alignItemCenter, { zIndex: 2 }]}
                  onPress={() => inviteOthers()}
                >
                  <Image
                    source={require('../../../assets/icons/Plus.png')}
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
                    source={require('../../../assets/icons/GroupBlack.png')}
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
                    source={require('../../../assets/icons/DescriptionBlack.png')}
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
                        source={require('../../../assets/icons/Logout.png')}
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
                        source={require('../../../assets/icons/Edit.png')}
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
                        source={require('../../../assets/icons/Plus.png')}
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
                        source={require('../../../assets/icons/Hide.png')}
                        style={[bottomSheet.itemIcon]}
                      />
                      <CustomText>Block User</CustomText>
                    </Pressable>
                  </View>
                  
                )
              } */}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GroupSettings;

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