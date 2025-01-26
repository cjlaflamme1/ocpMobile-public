import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { SignupObject } from '../models/SignupObject';
import { login, postReset, requestReset, ResetDTO, signUp } from '../api/authAPI';

interface AuthState {
  loggedIn: boolean;
  email: string;
  accessToken: string | null;
}

interface InitialState {
  currentAuth: AuthState | null;
  resetPass: {
    email: string;
    token: number;
  } | null;
  status: 'idle' | 'loading' | 'failed';
  error: any;
}

const initialState: InitialState = {
  currentAuth: null,
  resetPass: null,
  status: 'idle',
  error: null,
};

const signUpAsync = createAsyncThunk(
  'auth/signup',
  async (newUser: SignupObject, { rejectWithValue }) => {
    try {
      const response: any = await signUp(newUser);
      const newUserAuth: AuthState = {
        loggedIn: false,
        email: '',
        accessToken: null,
      }
      if (response.data.accessToken) {
        await SecureStore.setItemAsync('accessToken', response.data.accessToken);
        response.data.accessToken = null;
        newUserAuth.accessToken = response.data.accessToken;
        newUserAuth.loggedIn = true;
        newUserAuth.email = response.data.email;
      }
      if (response.data.refreshToken) {
        await SecureStore.setItemAsync('refreshToken', response.data.refreshToken);
        response.data.refreshToken = null;
      }
      return newUserAuth;
     } catch (err: any) {
       return rejectWithValue({
         name: err.name,
         message: err.message,
       });
     }
  },
);

const signInAsync = createAsyncThunk(
  'auth/signin',
  async (signInObject: {email: string, password: string}, { rejectWithValue }) => {
    try {
      const response: any = await login(signInObject);
      const newUserAuth: AuthState = {
        loggedIn: false,
        email: '',
        accessToken: null,
      };
      if (response.data.accessToken) {
        await SecureStore.setItemAsync('accessToken', response.data.accessToken);
        response.data.accessToken = null;
        newUserAuth.accessToken = response.data.accessToken;
        newUserAuth.loggedIn = true;
        newUserAuth.email = response.data.email;
      }
      if (response.data.refreshToken) {
        await SecureStore.setItemAsync('refreshToken', response.data.refreshToken);
        response.data.refreshToken = null;
      }
      return newUserAuth;
    } catch (err: any) {
      console.error(err);
      return rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const requestResetAsync = createAsyncThunk(
  'auth/resetReq',
  async (email: string, { rejectWithValue }) => {
    try {
      const response: any = await requestReset(email);
      return response.data;
    } catch (err: any) {
      console.error(err);
      return rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  }
)

const postResetAsync = createAsyncThunk(
  'auth/postReset',
  async (body: ResetDTO, { rejectWithValue }) => {
    try {
      const response: any = await postReset(body);
      return response.data;
    } catch (err: any) {
      console.error(err);
      return rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginAction(state, action: PayloadAction<AuthState>) {
      state.currentAuth = action.payload;
    },
    logoutAction(state) {
      SecureStore.deleteItemAsync('accessToken');
      SecureStore.deleteItemAsync('refreshToken');
      state.currentAuth = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signUpAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.currentAuth = action.payload;
        state.error = null;
      })
      .addCase(signUpAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.currentAuth = null;
        state.error = action.payload;
      })
      .addCase(signInAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signInAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.currentAuth = action.payload;
        state.error = null;
      })
      .addCase(signInAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.currentAuth = null;
        state.error = action.payload;
      })
      .addCase(requestResetAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(requestResetAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.resetPass = action.payload;
        state.error = null;
      })
      .addCase(requestResetAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.resetPass = null;
        state.error = action.payload;
      })
      .addCase(postResetAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(postResetAsync.fulfilled, (state) => {
        state.status = 'idle';
        state.resetPass = null;
        state.error = null;
      })
      .addCase(postResetAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.resetPass = null;
        state.error = action.payload;
      });
  }
})

export const { loginAction, logoutAction } = authSlice.actions;
export default authSlice.reducer;

export {
  signUpAsync,
  signInAsync,
  requestResetAsync,
  postResetAsync,
};
