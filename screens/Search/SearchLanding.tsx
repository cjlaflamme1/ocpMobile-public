import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl, Pressable, TextInput } from 'react-native';
import { Image } from 'expo-image';
import CustomText from '../../components/CustomText';
import GroupCard from '../../components/GroupCard';
import PreviewGroupModal from '../../components/groups/PreviewGroupModal';
import { getAllGroupsAsync, getAllUserGroupsAsync, updateGroupAsync } from '../../store/groupSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import globalStyles from '../../styles/global';
import layoutStyles from '../../styles/layout';
import searchLandingStyle from '../../styles/screenStyles/search/searchLanding';
import { NavigationProp } from '@react-navigation/native';
import { getNotificationsAsync } from '../../store/notificationSlice';

interface Props {
  navigation: NavigationProp<any, any>;
};

const SearchLanding: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState('');
  const [debounceHandle, setDebounceHandle] = useState<any>();
  const dispatch = useAppDispatch();
  const searchForGroups = useAppSelector((state) => state.groupState.searchForGroups);
  const currentUser = useAppSelector((state) => state.userState.currentUser);

  useEffect(() => {
    if (searchForGroups && searchForGroups.count <= 0) {
      dispatch(getAllGroupsAsync({
        pagination: {
          take: 25,
          skip: 0,
        }
      }));
    }
    dispatch(getNotificationsAsync());
  }, [navigation]);

  if (!currentUser) {
    return (<View />);
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(getAllGroupsAsync({
      pagination: {
        take: 25,
        skip: 0,
      }
    }))
    setRefreshing(false);
  }

  const submitNameSearch = (searchQuery: string) => {
    if (searchQuery) {
      dispatch(getAllGroupsAsync({
        pagination: {
          take: 25,
          skip: 0,
        },
        filters: [
          {
            name: 'title',
            value: searchQuery,
          },
          {
            name: 'description',
            value: searchQuery,
          }
        ],
        filteredWithOr: true
      }));

    } else {
      dispatch(getAllGroupsAsync({
        pagination: {
          take: 25,
          skip: 0,
        }
      }));
    }
  }

  const joinGroup = async (groupid: string, userid: string) => {
    await dispatch(updateGroupAsync({
      id: groupid,
      body: {
        addingUserIds: [userid],
      },
    }));
    dispatch(getAllUserGroupsAsync({
      pagination: {
        take: 25,
        skip: 0,
      }
    }))
    dispatch(getAllGroupsAsync({
      pagination: {
        take: 25,
        skip: 0,
      }
    }));
    setSelectedPreview('');
  }

  return (
    <View style={[layoutStyles.screenContainer]}>
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={[layoutStyles.mt_3, layoutStyles.mb_2]}>
          <CustomText h1 bold>Search Results</CustomText>
        </View>
        <View style={[searchLandingStyle.searchContainer]}>
          {/* TODO: Add more filter options here */}
          <Pressable
            // style={[groupsLandingStyle.searchIconPressable]}
            style={({pressed}) => {
              if (pressed) {
                return [searchLandingStyle.searchIconPressable, searchLandingStyle.searchIconPressed]
              } else {
                return [searchLandingStyle.searchIconPressable];
              }
            }}
          >
            <Image 
              source={require('../../assets/icons/searchBarIcon.png')}
              style={[{width: 24, height: 24}]}
            />
          </Pressable>
          <TextInput
            placeholder='Search'
            style={[searchLandingStyle.searchBar]}
            onChangeText={(e) => {
              if (debounceHandle) {
                clearTimeout(debounceHandle);
              }
              const handle = setTimeout(() => submitNameSearch(e), 750);
              setDebounceHandle(handle);
            }}
          />
        </View>
        <View style={[layoutStyles.mt_2]}>
          <CustomText style={[globalStyles.mutedText]}>{!searchForGroups || !searchForGroups.groups || searchForGroups.groups.length <= 0 ? 'No' : searchForGroups.groups.length} results found.</CustomText>
        </View>
        <View>
          {
            searchForGroups &&
            searchForGroups.groups &&
            searchForGroups.groups.length > 0 ?
            searchForGroups.groups
              // .filter((group) => {
              //   let include = true;
              //   if (group.users && group.users.length > 0) {
              //     const found = group.users.find((u) => u.id === currentUser.id);
              //     if (found) {
              //       include = false;
              //     }
              //   }
              //   if (group.groupAdmins && group.groupAdmins.length > 0) {
              //     const found = group.groupAdmins.find((u) => u.id === currentUser.id);
              //     if (found) {
              //       include = false;
              //     }
              //   }
              //   if (include) {
              //     return group;
              //   }
              // })
              .map((group) => (
              <Pressable 
                key={`userGroupCard-${group.id}`}
                onPress={() => group.users.find((u) => u.id === currentUser.id) ? navigation.navigate('Groups', { screen: 'View Group', params: { groupId: group.id}}) : setSelectedPreview(group.id)}
              >
                <GroupCard
                  groupTitle={group.title}
                  numberOfMembers={group.users ? group.users.length : 0}
                  imageSource={group.imageGetUrl ? {
                    uri: group.imageGetUrl
                  } : require('../../assets/150x150.png')}
                />
                <PreviewGroupModal
                  group={group}
                  isVisible={selectedPreview === group.id}
                  closeModal={() => setSelectedPreview('')}
                  acceptAction={() => joinGroup(group.id, currentUser.id)}
                />
              </Pressable>
              )) : (
                <View style={[layoutStyles.alignItemCenter, layoutStyles.mt_3]}>
                  <CustomText>No results, try other parameters.</CustomText>
                </View>
              )
          }
        </View>
      </ScrollView>
    </View>
  );
};

export default SearchLanding;