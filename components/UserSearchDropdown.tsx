import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, ViewStyle, TextInputProps, TextInput, TouchableOpacity, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearUserList, getAllUsersAsync, User } from '../store/userSlice';
import inputStyle from '../styles/componentStyles/inputBar';
import CustomText from './CustomText';

export interface DropdownData<T, U> {
  key: T;
  value: U;
}

export interface TagData {
  key: any;
  name: string;
  onFilter: () => DropdownData<any, any>[] | undefined;
}

interface Props {
  testID?: string
  testIDDropdown?: string
  placeholder: string
  selected: Partial<User>[]
  setSelected: (selected: Partial<User>) => void
  searchOptions?: TextInputProps
  dropdownStyles?: ViewStyle
};

const UserSearchDropdown: React.FC<Props> = (props: Props) => {
  const {
    testID,
    testIDDropdown,
    placeholder,
    searchOptions,
    selected,
    setSelected,
    dropdownStyles,
  } = props;
  const [debounceHandle, setDebounceHandle] = useState<any>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dispatch = useAppDispatch();
  const userList = useAppSelector((state) => state.userState.userList);

  const dropdownHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!userList || userList.count === 0) {
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
  }, []);

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

  const getUserDropdownList = () => {
    const newDropdown: DropdownData<string, string>[] = [];
    if (userList && userList.users && userList.users.length > 0) {
      const newUserList = userList.users.slice().filter((user) => !selected.find((f) => f.id === user.id));
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
        setSelected(selectedUser);
      }
    }
    onDropdownToggle(false);
  }

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

  return (
    <View>
      {
        isDropdownOpen ? (
            <View style={[inputStyle.fullWidthInputContainer, style.searchBoxOverride]}>
              <TextInput
                onChangeText={(e) => {
                  if (debounceHandle) {
                    clearTimeout(debounceHandle);
                  }
                  const handle = setTimeout(() => submitUserSearch(e), 750);
                  setDebounceHandle(handle);
                }}
                {...searchOptions}
                placeholder={placeholder}
                autoCorrect={false}
                style={[inputStyle.fullWidthInput]}
              />
            </View>
        ) : (
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TouchableOpacity
                testID={testID}
                onPress={() => onDropdownToggle(true)}
                style={[inputStyle.fullWidthInput]}
              >
                <CustomText>
                  { placeholder }
                </CustomText>
              </TouchableOpacity>
            </View>
        )
      }
      {
        isDropdownOpen && (
          <View>

            <Animated.View
              testID={testIDDropdown}
              style={[
                  style.dropdown,
                  {maxHeight: 200},
                  dropdownStyles
              ]}
            >
              <View style={[style.dropdownScroll]}>
                <ScrollView>
                  {
                    getUserDropdownList().map((item) => (
                      <Pressable
                        key={`dropdown-${item.key}`}
                        onPress={() => onSelect(item)}
                        style={[style.dropdownItem]}
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
  );
};

const style = StyleSheet.create({
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
  dropdownSearchBox: {
      flexDirection: "row",
      borderWidth: 2,
      borderRadius: 5,
      borderColor: "black",
      paddingHorizontal: 8,
      paddingVertical: 4,
      minHeight: 30,
  },
  dropdownItem: {
    paddingVertical: 10,
  },
  dropdownSearchInput: {
      flexGrow: 1,
      padding: 0,
      margin: 0,
      marginLeft: 8,
  },
  selectedText: {
      flexGrow: 1,
      color: "#3F3F46",
      fontSize: 16,
      fontWeight: "500",
      lineHeight: 20,
      marginVertical: "auto",
      marginLeft: 8,
      paddingVertical: 4,
  },
  searchIcon: {
      paddingVertical: 4,
      paddingRight: 6,
      marginVertical: "auto"
  },
  exitIcon: {
      alignSelf: "center"
  },
  searchDivider: {
      marginVertical: 4,
      borderRightWidth: 1,
      borderColor: "#E4E4E7"
  }
});

export default UserSearchDropdown;