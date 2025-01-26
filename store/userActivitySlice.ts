import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteUserActivity, getOneUserActivity, getUserActivities, updateUserActivity } from '../api/userActivityAPI';
import { createUserActivity } from '../api/userAPI';
import { CreateUserActivityDTO, UserActivity } from './userSlice';

interface UserActivityState {
  userActivities: UserActivity[] | null;
  selectedUserActivity: UserActivity | null;
  status: 'idle' | 'loading' | 'failed';
  error: any;
}

const initialState: UserActivityState = {
  userActivities: null,
  selectedUserActivity: null,
  status: 'idle',
  error: null,
}

const createUserActivityAsync = createAsyncThunk(
  'userActivity/create',
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
  },
);

const updateUserActivityAsync = createAsyncThunk(
  'userActivity/update',
  async (arg: { id: string, body: Partial<UserActivity> }, { rejectWithValue }) => {
    try {
      const response: any = await updateUserActivity(arg.id, arg.body);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  }
)

const getUserActivitiesAsync = createAsyncThunk(
  'userActivity/get',
  async (arg, { rejectWithValue }) => {
    try {
      const response: any = await getUserActivities();
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const getOneUserActivityAsync = createAsyncThunk(
  'userActivity/getOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const response: any = await getOneUserActivity(id);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const deleteUserActivityAsync = createAsyncThunk(
  'userActivity/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response: any = await deleteUserActivity(id);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const userActivitySlice = createSlice({
  name: 'userActivity',
  initialState,
  reducers: {
    clearUserActivities(state) {
      state.userActivities = null;
    },
    clearSelectedUserActivity(state) {
      state.selectedUserActivity = null;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(getUserActivitiesAsync.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(getUserActivitiesAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.userActivities = action.payload;
      state.error = null;
    })
    .addCase(getUserActivitiesAsync.rejected, (state, action) => {
      state.status = 'failed';
      state.userActivities = null;
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
    .addCase(getOneUserActivityAsync.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(getOneUserActivityAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.selectedUserActivity = action.payload;
      state.error = null;
    })
    .addCase(getOneUserActivityAsync.rejected, (state, action) => {
      state.status = 'failed';
      state.selectedUserActivity = null;
      state.error = action.payload;
    })
    .addCase(updateUserActivityAsync.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(updateUserActivityAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.selectedUserActivity = action.payload;
      state.error = null;
    })
    .addCase(updateUserActivityAsync.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    })
    .addCase(deleteUserActivityAsync.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(deleteUserActivityAsync.fulfilled, (state) => {
      state.status = 'idle';
      state.error = null;
    })
    .addCase(deleteUserActivityAsync.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  }
})

export const { clearUserActivities, clearSelectedUserActivity } = userActivitySlice.actions;

export default userActivitySlice.reducer;

export {
  createUserActivityAsync,
  getUserActivitiesAsync,
  getOneUserActivityAsync,
  updateUserActivityAsync,
  deleteUserActivityAsync,
}
