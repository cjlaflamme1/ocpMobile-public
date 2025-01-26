import React, { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import CustomText from '../../components/CustomText';
import UpcomingEventCard from '../../components/UpcomingEventCard';
import globalStyles from '../../styles/global';
import layoutStyles from '../../styles/layout';
import calendarStyles from '../../styles/screenStyles/calendar/calendar';
import { NavigationProp } from '@react-navigation/native';

interface Props {
  navigation: NavigationProp<any, any>;
};

const CalendarLanding: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [radioSelector, setRadioSelector] = useState(0);
  const onRefresh = () => {
    setRefreshing(true);
    // Refresh functions here
    setRefreshing(false);
  }
  return (
    <View style={[layoutStyles.screenContainer]}>
      <ScrollView showsVerticalScrollIndicator={false}  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <CustomText style={[layoutStyles.mt_3]} h1 bold>Upcoming Events</CustomText>
        <Calendar
          style={[calendarStyles.calendar, layoutStyles.mt_2]}
        />
        <View style={[calendarStyles.radioTextContainer]}>
          <Pressable onPress={() => setRadioSelector(0)} style={[(radioSelector === 0 && calendarStyles.bottomBorder)]}>
            <CustomText bold style={[calendarStyles.radioText, (radioSelector !== 0 && globalStyles.mutedText)]}>Your Events</CustomText>
          </Pressable>
          <Pressable onPress={() => setRadioSelector(2)} style={[(radioSelector === 2 && calendarStyles.bottomBorder)]}>
            <CustomText style={[calendarStyles.radioText, (radioSelector !== 2 && globalStyles.mutedText)]}>Explore Upcoming</CustomText>
          </Pressable>
        </View>
        <View>
          {/* Schedule events */}
          <UpcomingEventCard
            eventDate={new Date()}
            eventTitle={'February Ski Tour'}
            imageSource={require('../../assets/profilePhotos/testSportImage.jpg')}
          />
          <UpcomingEventCard
            eventDate={new Date((new Date()).setMonth((new Date().getMonth()) + 1))}
            eventTitle={'Spring Ski Tour'}
            imageSource={require('../../assets/profilePhotos/testSportImage.jpg')}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CalendarLanding;