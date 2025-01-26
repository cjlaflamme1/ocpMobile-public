import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createUserActivity, getAllUsers, getCurrentUser, getOneUser, requestDeleteUser, updateCurrentUser } from '../api/userAPI';
import { QueryObject } from '../models/QueryObject';
import { ActivityType } from './activityTypeSlice';
import { Group } from './groupSlice';

export interface CreateUserActivityDTO {
  activityName: string;
  information: string;
  favoriteLocations: string;
  yearsParticipating: string;
  preferredGroupDetails: string;
  seekingMentor: boolean;
  mentorNeedsDetails: string;
  offeringMentorship: boolean;
  provideMentorshipDetails: string;
  coverPhoto: string;
}

export interface UserActivity {
  id: string;
  activityName: string;
  information: string;
  favoriteLocations: string;
  yearsParticipating: string;
  preferredGroupDetails: string;
  seekingMentor: boolean;
  mentorNeedsDetails: string;
  offeringMentorship: boolean;
  provideMentorshipDetails: string;
  coverPhoto: string;
  getImageUrl: string | null;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  location: string;
  profilePhoto: string | null;
  expoPushToken: string | null;
  createdAt: Date;
  updatedAt: Date;
  imageGetUrl?: string;
  activities: UserActivity[] | null;
  groups?: Group[];
  adminForGroups?: Group[];
}

interface UserState {
  currentUser: User | null;
  selectedUser: User | null;
  userList: {
    users: User[] | null;
    count: number;
  };
  status: 'idle' | 'loading' | 'failed';
  error: any;
}

const initialState: UserState = {
  currentUser: null,
  selectedUser: null,
  userList: {
    users: null,
    count: 0,
  },
  status: 'idle',
  error: null,
}

const getCurrentUserAsync = createAsyncThunk(
  'user/getCurrent',
  async (arg, { rejectWithValue }) => {
    try {
      const response: any = await getCurrentUser();
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const getAllUsersAsync = createAsyncThunk(
  'user/getAll',
  async (arg: QueryObject, { rejectWithValue }) => {
    try {
      const response: any = await getAllUsers(arg);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const updateCurrentUserAsync = createAsyncThunk(
  'user/updateCurrent',
  async (arg: { id: string, updateBody: Partial<User> }, { rejectWithValue }) => {
    try {
      const response: any = await updateCurrentUser(arg.id, arg.updateBody);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message:err.message,
      });
    }
  },
);

const createUserActivityAsync = createAsyncThunk(
  'user/createUserActivity',
  async (arg: CreateUserActivityDTO, { rejectWithValue }) => {
    try {
      const response: any = await createUserActivity(arg);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  }
)

const getOneUserAsync = createAsyncThunk(
  'user/getOne',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response: any = await getOneUser(userId);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const requestDeleteUserAsync = createAsyncThunk(
  'user/deleteRequest',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response: any = await requestDeleteUser(userId);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserState(state) {
      state.currentUser = null;
    },
    clearUserList(state) {
      state.userList = {
        users: null,
        count: 0,
      };
    },
    clearSelectedUser(state) {
      state.selectedUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCurrentUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(getCurrentUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.currentUser = null;
        state.error = action.payload;
      })
      .addCase(updateCurrentUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCurrentUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(updateCurrentUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.currentUser = null;
        state.error = action.payload;
      })
      .addCase(createUserActivityAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUserActivityAsync.fulfilled, (state) => {
        state.status = 'idle';
        state.error = null;
      })
      .addCase(createUserActivityAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getAllUsersAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllUsersAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.userList = action.payload;
        state.error = null;
      })
      .addCase(getAllUsersAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.userList = {
          users: null,
          count: 0,
        };
        state.error = action.payload;
      })
      .addCase(getOneUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getOneUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.selectedUser = action.payload;
        state.error = null;
      })
      .addCase(getOneUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.selectedUser = null;
        state.error = action.payload;
      })
      .addCase(requestDeleteUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(requestDeleteUserAsync.fulfilled, (state) => {
        state.status = 'idle';
        state.error = null;
      })
      .addCase(requestDeleteUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
})

export const { clearUserState, clearUserList, clearSelectedUser } = userSlice.actions;

export default userSlice.reducer;

export {
  getCurrentUserAsync,
  updateCurrentUserAsync,
  createUserActivityAsync,
  getAllUsersAsync,
  getOneUserAsync,
  requestDeleteUserAsync,
}
