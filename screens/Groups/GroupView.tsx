import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, View, RefreshControl, Pressable, Dimensions, Platform } from 'react-native';
import { Image } from 'expo-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomText from '../../components/CustomText';
import layoutStyles from '../../styles/layout';
import globalStyles from '../../styles/global';
import groupViewStyle from '../../styles/screenStyles/groups/groupView';
import PostMessageCard from '../../components/groups/PostMessage';
import MessageCard from '../../components/groups/MessageCard';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearSelectedGroup, createGroupInvitesAsync, getAllUserGroupsAsync, getOneGroupAsync, updateGroupAsync } from '../../store/groupSlice';
import { clearPosts, createGroupPostAsync, CreateGroupPostDto, getAllGroupPostsAsync } from '../../store/groupPostSlice';
import { QueryObject, SortOrder } from '../../models/QueryObject';
import SendInviteModal from '../../components/groups/SendInviteModal';
import { User } from '../../store/userSlice';
import PrimaryButton from '../../components/PrimaryButton';
import { getAllGroupEventsAsync } from '../../store/groupEventSlice';
import EventCard from '../../components/groups/GroupEventCard';
import UserListModal from '../../components/modals/UserListModal';
import SettingsSheet from '../../components/bottomsheet/SettingsBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import GroupDescriptionModal from '../../components/modals/GroupDescripModal';
import { NavigationProp } from '@react-navigation/native';
import TripleHeader from '../../components/headers/TripleHeader';
import GroupSettings from '../../components/bottomsheet/androidModals/GroupSettings';

interface Props {
  navigation: NavigationProp<any, any>;
  route: any;
};

const GroupView: React.FC<Props> = ({ navigation, route }) => {
  const [queryParams, setQueryParams] = useState<QueryObject>({
    pagination: {
      skip: 0,
      take: 25,
    },
    orderBy: {
      column: 'createdAt',
      order: SortOrder.DESC,
    }
  });
  const groupId = route.params.groupId;
  const [modalVisible, setModalVisible] = useState(false);
  const [androidModal, setAndroidModal] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [descripModal, setDescripModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [radioSelector, setRadioSelector] = useState(0);
  const dispatch = useAppDispatch();
  const scrollViewRef = useRef<KeyboardAwareScrollView|null>(null);

  const selectedGroup = useAppSelector((state) => state.groupState.selectedGroup);
  const currentGroupsPosts = useAppSelector((state) => state.groupPostState.currentGroupsPosts);
  const currentGroupEvents = useAppSelector((state) => state.groupEventState.currentGroupEvents);
  const currentUser = useAppSelector((state) => state.userState.currentUser);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleClosePress = () => bottomSheetRef?.current?.close();

  const handleOpen = () => bottomSheetRef?.current?.expand();

  const handleOpenAndroid = () => {
    setAndroidModal(true);
  };

  useEffect(() => {
    const nav = { navigation: navigation, defaultView: 'Groups Landing'}
    navigation.setOptions({
      header: () => (
        <TripleHeader nav={nav} title='View Group'>
          <Pressable
            style={[layoutStyles.flexRow,
            layoutStyles.alignItemCenter,
            { zIndex: 2, height: 30, width: 30 }
          ]}
            onPress={() => {Platform.OS === 'ios' ? handleOpen() : handleOpenAndroid()}}
          >
            <View style={[ { height: 24, width: 24 } ]}>
              <Image
                source={require('../../assets/icons/Setting.png')}
                contentFit='contain'
                style={[{ height: 24, width: 24 }, layoutStyles.mr_1]}
              />
            </View>
          </Pressable>
        </TripleHeader>
      )
    });
  }, [navigation, bottomSheetRef, bottomSheetRef?.current]);

  useEffect(() => {
    if (!selectedGroup || (selectedGroup.id !== groupId)) {
      dispatch(getOneGroupAsync(groupId));
    }
    if (selectedGroup || groupId) {
      dispatch(getAllGroupPostsAsync({
        pagination: {
          skip: 0,
          take: 25,
        },
        orderBy: {
          column: 'createdAt',
          order: SortOrder.DESC,
        },
        filters: [{
          name: 'group.id',
          value: groupId,
        }]
      }));
      dispatch(getAllGroupEventsAsync({
        pagination: {
          skip: 0,
          take: 25,
        },
        orderBy: {
          column: 'createdAt',
          order: SortOrder.DESC,
        },
        filters: [{
          name: 'group.id',
          value: groupId,
        }]
      }));
    }
    return () => {
      dispatch(clearPosts());
      dispatch(clearSelectedGroup());
    }
  }, [navigation, groupId]);

  const memberNumber = selectedGroup?.users ? selectedGroup.users.length : 0;

  const adminUser = useCallback(() => {
    let adminPermission = false;
    if (currentUser
      && selectedGroup
      && selectedGroup.groupAdmins
      && selectedGroup.groupAdmins.length > 0
      && selectedGroup.groupAdmins.find((admin) => admin.id === currentUser.id)) {
        adminPermission = true;
      }
    return adminPermission;
  }, [currentUser, groupId, selectedGroup]);

  const onRefresh = async () => {
    setRefreshing(true);
      await Promise.all(
        [
          dispatch(getOneGroupAsync(groupId)),
          dispatch(getAllGroupPostsAsync({
            ...queryParams,
            filters: [{
              name: 'group.id',
              value: groupId,
            }]
          })),
          dispatch(getAllGroupEventsAsync({
            pagination: {
              skip: 0,
              take: 25,
            },
            orderBy: {
              column: 'createdAt',
              order: SortOrder.DESC,
            },
            filters: [{
              name: 'group.id',
              value: groupId,
            }]
          }))
        ]
      );
    setRefreshing(false);
  }

  const submitNewPost = async (post: CreateGroupPostDto) => {
    const newPost = await dispatch(createGroupPostAsync(post));
    if (newPost && newPost.meta.requestStatus === 'fulfilled') {
      dispatch(getAllGroupPostsAsync({
        ...queryParams,
        filters: [{
          name: 'group.id',
          value: groupId,
        }]
      }));
    }
  }

  const submitInvites = async (invites: Partial<User>[]) => {
    const inviteSubmission = await dispatch(createGroupInvitesAsync({
      groupid: groupId,
      userIds: invites.map((user) => user.id || ''),
    }));
    if (inviteSubmission.meta.requestStatus === 'fulfilled') {
      setModalVisible(false);
      onRefresh();
    }
  }

  const leaveGroup = async () => {
    if (currentUser && selectedGroup) {
      const res = await dispatch(updateGroupAsync({
        id: selectedGroup.id,
        body: {
          removeUserIds: [currentUser.id],
        }
      }));
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(getAllUserGroupsAsync({
          pagination: {
            take: 25,
            skip: 0,
          },
          filteredWithOr: true,
        }));
        navigation.goBack();
      }
    }
  };
  const { width } = Dimensions.get('window');

  if (!selectedGroup) {
    return (<View />);
  }

  return (
    <View style={[layoutStyles.screenContainer]}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[layoutStyles.mb_3]}>
          <View style={[layoutStyles.mt_2]}>
            <Image
              source={ selectedGroup.imageGetUrl ? {
                uri: selectedGroup.imageGetUrl
              } : require('../../assets/300x200.png')}
              style={[{ width: '100%', height: (width * 0.75), borderRadius: 25}]}
            />
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText h1 bold>
              { selectedGroup.title }
            </CustomText>
            {
              selectedGroup.location
              && (
                <View style={[layoutStyles.flexRow, layoutStyles.jStart, layoutStyles.m_1]}>
                  <Image 
                    source={require('../../assets/icons/location.png')}
                    style={[{width: 16, height: 16, alignSelf: 'center'}]}
                    contentFit='contain'
                  />
                  <CustomText style={[globalStyles.mutedText]}>{selectedGroup.location}</CustomText>
                </View>
              )
            }
            <View style={[layoutStyles.dFlex, layoutStyles.flexRow]}>
              <Pressable style={[groupViewStyle.viewMembersButton]} onPress={() => setUserModal(true)}>
                <CustomText style={[globalStyles.mutedText, { textDecorationLine: 'underline' }]}>
                  {`${memberNumber} Member${(memberNumber > 1) ? 's' : ''}`}
                </CustomText>
              </Pressable>
            </View>
          </View>
          <View style={[groupViewStyle.radioTextContainer]}>
            <Pressable onPress={() => setRadioSelector(0)} style={[(radioSelector <= 0 && groupViewStyle.bottomBorder)]}>
              <CustomText bold style={[groupViewStyle.radioText, (radioSelector > 0 && globalStyles.mutedText)]}>Message Board</CustomText>
            </Pressable>
            <Pressable onPress={() => setRadioSelector(1)} style={[(radioSelector > 0 && groupViewStyle.bottomBorder)]}>
              <CustomText style={[groupViewStyle.radioText, (radioSelector <= 0 && globalStyles.mutedText)]}>Events</CustomText>
            </Pressable>
          </View>
          {
            radioSelector === 0 &&
            (
              <View>
                <View style={[layoutStyles.mt_2, layoutStyles.mb_2]}>
                  <PostMessageCard
                    buttonText='Submit'
                    placeholderText='Write post here.'
                    groupId={selectedGroup.id}
                    handleSubmit={(post) => submitNewPost(post)}
                  />
                </View>
                {
                  currentGroupsPosts &&
                  currentGroupsPosts.count > 0 &&
                  currentGroupsPosts.groupPosts?.map((post) => (
                    <View key={`grouppost-${post.id}`} style={[layoutStyles.mb_2]}>
                      <MessageCard
                        navigation={navigation}
                        userPosted={{
                          name: `${post.author.firstName} ${post.author.lastName}`,
                          profile: post.authorImageUrl ? { uri: post.authorImageUrl } : require('../../assets/150x150.png'),
                        }}
                        postId={{
                          id: post.id,
                          postText: post.postText,
                          postImage: post.imageGetUrl ? { uri: post.imageGetUrl } : undefined,
                          createdAt: post.createdAt,
                        }}
                        responseCount={post.responses ? post.responses.length : 0}
                      />
                    </View>
                  ))
                }
              </View>
            )
          }
          {
            radioSelector === 1 &&
            (
              <View>
                <View style={[layoutStyles.mt_2, layoutStyles.mb_2]}>
                  <PrimaryButton
                    buttonText="Create New Event"
                    callback={() => navigation.navigate('Create Group Event')}
                  />
                </View>
                {
                  currentGroupEvents &&
                  currentGroupEvents.groupEvents &&
                  currentGroupEvents.groupEvents.length > 0 &&
                  currentGroupEvents.groupEvents.map((event) => (
                    <View key={`eventCard-${event.id}`} style={[layoutStyles.mb_2]}>
                      <EventCard
                        userPosted={{
                          name: event.creator.firstName,
                          profile: event.creator.imageGetUrl ? { uri: event.creator.imageGetUrl } : require('../../assets/150x150.png'),
                        }}
                        event={event}
                        responseCount={event.responses ? event.responses.length : 0}
                        joiningCount={event.attendingUsers ? event.attendingUsers.length : 0}
                        navigation={navigation}
                      />
                    </View>
                  ))
                }
              </View>
            )
          }
        </View>
      </KeyboardAwareScrollView>
      <SendInviteModal
        groupId={selectedGroup.id}
        isVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
        rejectAction={() => setModalVisible(false)}
        acceptAction={(e) => submitInvites(e)}
        navigation={navigation}
        selectedGroup={selectedGroup}
      />
      <UserListModal
        navigation={navigation}
        isVisible={userModal}
        closeModal={() => setUserModal(false)}
        userList={selectedGroup.users || []}
      />
      <GroupDescriptionModal
        isVisible={descripModal}
        closeModal={() => setDescripModal(false)}
        groupDescription={selectedGroup.description}
      />
      {
        Platform.OS === 'ios' && (
          <SettingsSheet
            closeSheet={() => handleClosePress()}
            bottomSheetRef={bottomSheetRef}
            customSnapPoints={['75%']}
            inviteMembers={() => setModalVisible(true)}
            adminView={adminUser()}
            viewMembers={() => setUserModal(true)}
            viewDescription={() => setDescripModal(true)}
            leaveGroup={leaveGroup}
            editGroup={() => navigation.navigate('Edit Group', { groupId: selectedGroup.id })}
          />
        )
      }
      {
        Platform.OS === 'android' && (
          <GroupSettings
            isVisible={androidModal}
            closeModal={() => setAndroidModal(false)}
            inviteMembers={() => setModalVisible(true)}
            adminView={adminUser()}
            viewMembers={() => setUserModal(true)}
            viewDescription={() => setDescripModal(true)}
            leaveGroup={leaveGroup}
            editGroup={() => navigation.navigate('Edit Group', { groupId: selectedGroup.id })}
          />
        )
      }
    </View>
  );
};

export default GroupView;