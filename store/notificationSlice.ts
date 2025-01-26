import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from "./userSlice";
import { getNotifications, updateNotification } from '../api/notificationAPI';

export interface Notifications {
  id: string;
  title: string;
  description: string;
  groupId?: string;
  postId?: string;
  eventId?: string;
  invite: boolean;
  viewed: boolean;
  createdAt: Date;
  user?: User;
}

interface NotificationState {
  notifications: Notifications[] | null;
  notificationCount: number;
  status: 'idle' | 'loading' | 'failed';
  error: any;
}

const initialState: NotificationState = {
  notifications: null,
  notificationCount: 0,
  status: 'idle',
  error: null,
}

const getNotificationsAsync = createAsyncThunk(
  'notifications/getAll',
  async (arg, { rejectWithValue }) => {
    try {
      const response: any = await getNotifications();
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const updateNotificationAsync = createAsyncThunk(
  'notifications/update',
  async (arg: { id: string, body: Partial<Notifications>}, { rejectWithValue }) => {
    try {
      const response: any = await updateNotification(arg.id, arg.body);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotifications(state) {
      state.notifications = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotificationsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getNotificationsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.notifications = action.payload;
        state.notificationCount = action.payload && action.payload.length > 0 ? action.payload.filter((i: Notifications) => !i.viewed).length : 0;
        state.error = null;
      })
      .addCase(getNotificationsAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.notifications = null;
        state.error = action.payload;
      })
      .addCase(updateNotificationAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateNotificationAsync.fulfilled, (state) => {
        state.status = 'idle';
        state.error = null;
      })
      .addCase(updateNotificationAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      })
  }
})

export const { clearNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;

export {
  getNotificationsAsync,
  updateNotificationAsync,
}
