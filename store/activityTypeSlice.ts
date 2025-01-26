import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllActivityTypes } from '../api/activityTypeAPI';

export interface ActivityType {
  id: string;
  activityTitle: string;
}

interface ActivityTypeState {
  activityTypes: ActivityType[] | null;
  status: 'idle' | 'loading' | 'failed';
  error: any;
}

const initialState: ActivityTypeState = {
  activityTypes: null,
  status: 'idle',
  error: null,
}

const getAllActivityTypesAsync = createAsyncThunk(
  'activityTypes/getAll',
  async (arg, { rejectWithValue }) => {
    try {
      const response: any = await getAllActivityTypes();
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const activityTypeSlice = createSlice({
  name: 'activityType',
  initialState,
  reducers: {
    clearActivityTypes(state) {
      state.activityTypes = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllActivityTypesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllActivityTypesAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.activityTypes = action.payload;
        state.error = null;
      })
      .addCase(getAllActivityTypesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.activityTypes = null;
        state.error = action.payload;
      });
  }
})

export const { clearActivityTypes } = activityTypeSlice.actions;

export default activityTypeSlice.reducer;

export {
  getAllActivityTypesAsync,
}
