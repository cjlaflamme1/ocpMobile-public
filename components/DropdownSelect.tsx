import React, { useRef, useState } from 'react';
import { View, Animated, ViewStyle, TextInputProps, TextInput, TouchableOpacity, Pressable, StyleSheet, ScrollView } from 'react-native';
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
  data: DropdownData<any, any>[]
  placeholder: string
  selected: DropdownData<any, any> | null
  setSelected: (selected: DropdownData<any, any>) => void
  usePressable?: boolean
  tags?: TagData[]
  searchOptions?: TextInputProps
  searchBoxStyles?: ViewStyle
  dropdownStyles?: ViewStyle
};

const DropdownSelect: React.FC<Props> = (props: Props) => {
  const {
    testID,
    testIDDropdown,
    data,
    tags,
    placeholder,
    searchOptions,
    selected,
    setSelected,
    searchBoxStyles,
    dropdownStyles,
    usePressable
  } = props;
  const [value, setValue] = useState<string>("");
  const [filteredData, setFilteredData] = useState<DropdownData<string, string>[]>(data);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const dropdownHeight = useRef(new Animated.Value(0)).current;

  const resetData = () => {
    setFilteredData(data);
    setValue("");
  }

  const onSelect = (item: DropdownData<string, string>) => {
    setSelected(item);
    setValue(item.value);
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

  const onSearching = (text: string) => {
      setValue(text);
      const filtered = data.filter((item) => item.value.toLowerCase().includes(text.toLowerCase()));
      setFilteredData(filtered);
  }

  return (
    <View>
      {
        isDropdownOpen ? (
            <View style={[inputStyle.fullWidthInputContainer, style.searchBoxOverride]}>
              <TextInput
                value={value}
                onChangeText={onSearching}
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
                  { selected ? selected.value : placeholder }
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
                    data &&
                    data.map((item) => (
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

export default DropdownSelect;