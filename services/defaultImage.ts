import { ImageSourcePropType } from "react-native";

export const selectDefaultImage = (activityName: string): ImageSourcePropType => {
  if (activityName?.toLowerCase().includes('skiing')) {
    return require('../assets/profilePhotos/testSportImage.jpg');
  } else if (activityName?.toLowerCase().includes('paddling')) {
    return require('../assets/defaultImages/canoeDefault.png');
  }
  return require('../assets/defaultImages/defaultRunning.png');
};
