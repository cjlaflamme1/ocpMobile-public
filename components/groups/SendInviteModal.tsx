import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, TextInput, StyleSheet, Modal, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import CustomText from '../CustomText';
import layoutStyles from '../../styles/layout';
import { Group } from '../../store/groupSlice';
import PrimaryButton from '../PrimaryButton';
import { clearUserList, getAllUsersAsync, User } from '../../store/userSlice';
import UserIconSmall from '../UserIconSmall';
import inputStyle from '../../styles/componentStyles/inputBar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { NavigationProp } from '@react-navigation/native';

export interface DropdownData<T, U> {
  key: T;
  value: U;
}

interface Props {
  groupId: string;
  isVisible: boolean;
  acceptAction: (invites: Partial<User>[]) => void;
  rejectAction: () => void;
  closeModal: () => void;
  navigation: NavigationProp<any, any>;
  selectedGroup: Group,
};

const SendInviteModal: React.FC<Props> = (props: Props) => {
  const {
    groupId,
    isVisible,
    closeModal,
    acceptAction,
    rejectAction,
    navigation,
    selectedGroup,
  } = props;
  const [selectedUserIds, setSelectedUserIds] = useState<Partial<User>[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [debounceHandle, setDebounceHandle] = useState<any>();
  const dropdownHeight = useRef(new Animated.Value(0)).current;

  const dispatch = useAppDispatch();
  const userList = useAppSelector((state) => state.userState.userList);

  useEffect(() => {
    if (!userList || userList.count <= 0) {
      dispatch(getAllUsersAsync({
        pagination: {
          skip: 0,
          take: 8,
        },
      }));
    }
    return () => {
      dispatch(clearUserList());
    };
  }, [navigation]);
  
  const onDropdownToggle = (open: boolean) => {
    if (open) {
        setIsDropdownOpen(open);
        Animated.timing(dropdownHeight, {
            toValue: 200,
            duration: 500,
            useNativeDriver: false,
        }).start();
    } else {
        Animated.timing(dropdownHeight, {
            toValue: 10,
            duration: 600,
            useNativeDriver: false
        }).start(() => setIsDropdownOpen(open));
    }
  }

  const submitUserSearch = (nameSearch: string) => {
    dispatch(getAllUsersAsync({
      pagination: {
          skip: 0,
          take: 8,
      },
      filters: [
        {
          name: 'firstName',
          value: nameSearch,
        },
        {
          name: 'lastName',
          value: nameSearch,
        }
      ],
      filteredWithOr: true,
    }))
  };

  const submitInvites = () => {
    acceptAction(selectedUserIds);
  };

  const getUserDropdownList = () => {
    const newDropdown: DropdownData<string, string>[] = [];
    if (userList && userList.users && userList.users.length > 0) {
      const newUserList = userList.users.slice().filter((user) => !selectedUserIds.find((f) => f.id === user.id)).filter((user) => {
        let returnUser = true;
        if (user.groups && user.groups.length > 0) {
          const alreadyInGroup = user.groups.find((g) => g.id === selectedGroup.id);
          if (alreadyInGroup) {
            returnUser = false;
          }
        }
        if (user.adminForGroups && user.adminForGroups.length > 0) {
          const alreadyInGroup = user.adminForGroups.find((g) => g.id === selectedGroup.id);
          if (alreadyInGroup) {
            returnUser = false;
          }
        }
        return returnUser;
      });
      if (newUserList && newUserList.length > 0) {
        newUserList.map((user) => {
          newDropdown.push({
            key: user.id,
            value: `${user.firstName} ${user.lastName}`
          })
        })
      } else {
        newDropdown.push({
          key: '',
          value: 'No users found',
        });
      }
    } else {
      newDropdown.push({
        key: '',
        value: 'No users found',
      });
    }
    return newDropdown;
  };

  const onSelect = (item: DropdownData<string, string>) => {
    if (userList && userList.users && userList.users.length > 0) {
      const selectedUser = userList.users.find((user) => user.id === item.key);
      if (selectedUser) {
        setSelectedUserIds([...selectedUserIds, selectedUser]);
      }
    }
    onDropdownToggle(false);
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <View style={inviteStyle.centeredView}>
        <View style={inviteStyle.modalView}>
          <Pressable style={[{ position: 'absolute', right: 20, top: 20}]} onPress={() => {
            closeModal();
            setSelectedUserIds([]);
          }}>
            <Image
              source={require('../../assets/icons/Close-Square.png')}
              style={[{ height: 24, width: 24 }]}
              contentFit='contain'
            />
          </Pressable>
          <View style={[layoutStyles.mb_3]}>
            <View style={[ layoutStyles.dFlex, layoutStyles.mt_2 ]}>
              {
                isDropdownOpen ? 
                (
                  <View style={[inputStyle.fullWidthInputContainer, inviteStyle.searchBoxOverride, { minWidth: '100%' }]}>
                    <TextInput
                      onChangeText={(e) => {
                        if (debounceHandle) {
                          clearTimeout(debounceHandle);
                        }
                        const handle = setTimeout(() => submitUserSearch(e), 750);
                        setDebounceHandle(handle);
                      }}
                      placeholder={'Search for users...'}
                      autoCorrect={false}
                      style={[inputStyle.fullWidthInput, { flexGrow: 0, width: '100%' }]}
                    />
                  </View>
                ) : (
                  <View style={[inputStyle.fullWidthInputContainer, { minWidth: '100%' }]}>
                    <TouchableOpacity
                      testID={'fdsafda'}
                      onPress={() => onDropdownToggle(true)}
                      style={[inputStyle.fullWidthInput, { flexGrow: 0, width: '100%' }]}
                    >
                      <CustomText>
                        Search for users...
                      </CustomText>
                    </TouchableOpacity>
                  </View>
                )
              }
              {
                isDropdownOpen && (
                  <View>

                    <Animated.View
                      testID={'sdljkweoijf3902j'}
                      style={[
                          inviteStyle.dropdown,
                          {maxHeight: 200}
                      ]}
                    >
                      <View style={[inviteStyle.dropdownScroll]}>
                        <ScrollView>
                          {
                            getUserDropdownList().map((item) => (
                              <Pressable
                                key={`dropdown-${item.key}`}
                                onPress={() => onSelect(item)}
                                style={[inviteStyle.dropdownItem]}
                              >
                                <CustomText>{item.value}</CustomText>
                              </Pressable>
                            ))
                          }
                        </ScrollView>
                      </View>
                    </Animated.View>
                  </View>
                )
              }
            </View>
            <View style={[layoutStyles.flexRow, { flexWrap: 'wrap'}, layoutStyles.mt_2, layoutStyles.jCenter]}>
              {
                selectedUserIds
                && selectedUserIds.length > 0
                ? selectedUserIds.map((user) => (
                  <Pressable key={`selectedUser-${user.id}`}>
                    <UserIconSmall
                      imageSource={{ uri: user.imageGetUrl }}
                      userName={`${user.firstName} ${user.lastName}`}
                    />
                  </Pressable>
                )) : (
                  <CustomText>No users selected for invite.</CustomText>
                )
              }
            </View>
          </View>
          <PrimaryButton styles={[{ minWidth: '100%'}]} buttonText='Submit Invite' callback={submitInvites} />
        </View>
      </View>
    </Modal>
  );
};

export default SendInviteModal;

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
  searchBoxOverride: {
    zIndex: 2,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#A3ACB1',
    borderRadius: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    padding: 10,
    marginTop: -1,
    backgroundColor: 'white',
    zIndex: 1,
  },
  dropdownScroll: {
    flexDirection: "column",
    paddingHorizontal: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
  },
});