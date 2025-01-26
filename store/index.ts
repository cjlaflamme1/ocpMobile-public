import {
  configureStore, ThunkAction, Action, combineReducers,
} from '@reduxjs/toolkit';
import activityTypeSlice from './activityTypeSlice';
import authSlice from './authSlice';
import groupEventSlice from './groupEventSlice';
import groupPostSlice from './groupPostSlice';
import groupSlice from './groupSlice';
import userActivitySlice from './userActivitySlice';
import userSlice from './userSlice';
import notificationSlice from './notificationSlice';

const reducer = combineReducers({
  authState: authSlice,
  userState: userSlice,
  activityTypeState: activityTypeSlice,
  userActivityState: userActivitySlice,
  groupState: groupSlice,
  groupPostState: groupPostSlice,
  groupEventState: groupEventSlice,
  notificationState: notificationSlice,
});

export const store = configureStore({
  reducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
