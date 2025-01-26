import React, { useEffect, useRef, useState } from 'react';
import { View, RefreshControl, Pressable, Dimensions, Platform } from 'react-native';
import { Image } from 'expo-image';
import layoutStyles from '../../styles/layout';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { clearSelectedEvent, getOneGroupEventAsync, updateGroupEventAsync } from '../../store/groupEventSlice';
import ViewEvent from '../../components/events/ViewEvent';
import { NavigationProp } from '@react-navigation/native';
import EventBottomSheet from '../../components/bottomsheet/EventBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import TripleHeader from '../../components/headers/TripleHeader';
import EventSettings from '../../components/bottomsheet/androidModals/EventSettings';

interface Props {
  navigation: NavigationProp<any, any>;
  route: any;
};

const ViewGroupEvent: React.FC<Props> = ({ navigation, route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [androidModal, setAndroidModal] = useState(false);
  const eventId = route.params.eventId;
  const dispatch = useAppDispatch();
  const scrollViewRef = useRef<KeyboardAwareScrollView|null>(null);
  const selectedGroupEvent = useAppSelector((state) => state.groupEventState.selectedGroupEvent);
  const currentUser = useAppSelector((state) => state.userState.currentUser);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleClosePress = () => bottomSheetRef?.current?.close();

  const handleOpen = () => bottomSheetRef?.current?.expand();

  const handleOpenAndroid = () => {
    setAndroidModal(true);
  };

  useEffect(() => {
    if (!selectedGroupEvent || eventId !== selectedGroupEvent.id) {
      dispatch(getOneGroupEventAsync(eventId));
    }
    const nav = { navigation: navigation, defaultView: 'Groups Landing'}
    navigation.setOptions({
      header: () => (
        <TripleHeader nav={nav} title='View Event'>
            <Pressable
              style={[layoutStyles.flexRow,
              layoutStyles.alignItemCenter,
              { zIndex: 2, height: 30, width: 30 }
            ]}
              onPress={() => {Platform.OS === 'ios' ? handleOpen() : handleOpenAndroid()}}
            >
              <Image
                contentFit='contain'
                source={require('../../assets/icons/Setting.png')}
                style={[{ height: 24, width: 24 }, layoutStyles.mr_1]}
              />
            </Pressable>
          </TripleHeader>
      )
    });
    return () => {
      dispatch(clearSelectedEvent());
    }
  }, [navigation, eventId, bottomSheetRef, bottomSheetRef?.current]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(getOneGroupEventAsync(eventId));
    setRefreshing(false);
  };

  const leaveEvent = async () => {
    if (currentUser && selectedGroupEvent) {
      const res = await dispatch(updateGroupEventAsync({
        id: selectedGroupEvent.id,
        data: {
          removeUserIds: [currentUser.id]
        },
      }));
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(getOneGroupEventAsync(eventId));
      }
    }
  };

  const joinEvent = async () => {
    if (currentUser && selectedGroupEvent) {
      const res = await dispatch(updateGroupEventAsync({
        id: selectedGroupEvent.id,
        data: {
          attendingUserIds: [currentUser.id]
        },
      }));
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(getOneGroupEventAsync(eventId));
      }
    }
  };

  const editEvent = () => {
    navigation.navigate('Edit Group Event', { eventId: eventId })
  };

  const cancelEvent = async () => {
    if (currentUser && selectedGroupEvent) {
      const res = await dispatch(updateGroupEventAsync({
        id: selectedGroupEvent.id,
        data: {
          cancelled: true,
        },
      }));
      console.log(res);
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(getOneGroupEventAsync(eventId));
      }
    }
  };

  if (!selectedGroupEvent || !currentUser) {
    return (<View />);
  };

  return (
    <View style={[layoutStyles.screenContainer, { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1}]}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[layoutStyles.mb_3]}>
          <View>
            <ViewEvent navigation={navigation} event={selectedGroupEvent} currentUser={currentUser} />
          </View>
        </View>
      </KeyboardAwareScrollView>
      {
        Platform.OS === 'ios' && (
          <EventBottomSheet
            closeSheet={() => handleClosePress()}
            bottomSheetRef={bottomSheetRef}
            customSnapPoints={['50%']}
            creatorView={selectedGroupEvent.creator.id === currentUser.id}
            quitEvent={leaveEvent}
            joinEvent={joinEvent}
            cancelEvent={cancelEvent}
            attending={!!selectedGroupEvent.attendingUsers && !!selectedGroupEvent.attendingUsers.find((u) => u.id === currentUser.id)}
            editEvent={editEvent}
            expiredEvent={new Date(selectedGroupEvent.eventDate).valueOf() < new Date().valueOf()}
          />
        )
      }
      {
        Platform.OS === 'android' && (
          <EventSettings
            isVisible={androidModal}
            closeModal={() => setAndroidModal(false)}
            creatorView={selectedGroupEvent.creator.id === currentUser.id}
            quitEvent={leaveEvent}
            joinEvent={joinEvent}
            cancelEvent={cancelEvent}
            attending={!!selectedGroupEvent.attendingUsers && !!selectedGroupEvent.attendingUsers.find((u) => u.id === currentUser.id)}
            editEvent={editEvent}
            expiredEvent={new Date(selectedGroupEvent.eventDate).valueOf() < new Date().valueOf()}
          />
        )
      }
    </View>
  );
};

export default ViewGroupEvent;
