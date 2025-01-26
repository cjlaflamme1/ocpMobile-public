import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createGroupPost, createPostResponse, getAllGroupPosts, getOneGroupPost } from '../api/groupPostAPI';
import { getPresignedUrl } from '../api/s3API';
import { getOneUser } from '../api/userAPI';
import { QueryObject } from '../models/QueryObject';
import { Group } from './groupSlice';
import { User } from './userSlice';

export interface CreateGroupPostDto {
  image?: string;
  postText?: string;
  groupId: string;
}

export interface CreatePostResponsDto {
  responseText: string;
  groupPostId?: string;
  groupEventId?: string;
}

export interface PostResponse {
  id: string;
  responseText: string;
  author: User;
  createdAt: Date;
}

export interface GroupPost {
  id: string;
  image: string;
  postText: string;
  group?: Group;
  author: User;
  createdAt: Date;
  authorImageUrl?: string;
  imageGetUrl?: string;
  responses?: PostResponse[];
}

interface GroupPostState {
  currentGroupsPosts: {
    groupPosts: GroupPost[] | null;
    count: number;
  };
  selectedPost: GroupPost | null;
  status: 'idle' | 'loading' | 'failed';
  error: any;
}

const initialState: GroupPostState = {
  currentGroupsPosts: {
    groupPosts: [],
    count: 0,
  },
  selectedPost: null,
  status: 'idle',
  error: null,
}

const createGroupPostAsync = createAsyncThunk(
  'groupPost/create',
  async (arg: CreateGroupPostDto, { rejectWithValue }) => {
    try {
      const response: any = await createGroupPost(arg);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const createPostResponseAsync = createAsyncThunk(
  'groupPostResponse/create',
  async (arg: CreatePostResponsDto, { rejectWithValue }) => {
    try {
      const response: any = await createPostResponse(arg);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const getAllGroupPostsAsync = createAsyncThunk(
  'groupPost/getAll',
  async (params: QueryObject, { rejectWithValue }) => {
    try {
      const response: any = await getAllGroupPosts(params);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const getOneGroupPostAsync = createAsyncThunk(
  'groupPost/getOne',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response: any = await getOneGroupPost(postId);
      if (response.data && response.data.responses && response.data.responses.length > 0) {
        const userList: User[] = [];
        response.data.responses = await Promise.all(
          response.data.responses.map(async (response: PostResponse) => {
            if (response.author) {
              const foundUser = userList.find((ul) => ul.id === response.author.id);
              if (foundUser) {
                response.author = foundUser;
              } else {
                const res = await getOneUser(response.author.id);
                response.author = res.data;
                userList.push(res.data);
              }
              return response;
            }
          })
        )
      }
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const groupPostSlice = createSlice({
  name: 'groupPost',
  initialState,
  reducers: {
    clearPosts(state) {
      state.currentGroupsPosts = {
        groupPosts: [],
        count: 0,
      };
      state.selectedPost = null;
    },
    clearSelectedPost(state) {
      state.selectedPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(createGroupPostAsync.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(createGroupPostAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.selectedPost = action.payload;
      state.error = null;
    })
    .addCase(createGroupPostAsync.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    })
    .addCase(getAllGroupPostsAsync.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(getAllGroupPostsAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.currentGroupsPosts = action.payload;
      state.error = null;
    })
    .addCase(getAllGroupPostsAsync.rejected, (state, action) => {
      state.status = 'failed';
      state.currentGroupsPosts = {
        groupPosts: [],
        count: 0,
      };
      state.error = action.payload;
    })
    .addCase(getOneGroupPostAsync.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(getOneGroupPostAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.selectedPost = action.payload;
      state.error = null;
    })
    .addCase(getOneGroupPostAsync.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    })
    .addCase(createPostResponseAsync.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(createPostResponseAsync.fulfilled, (state) => {
      state.status = 'idle';
      state.error = null;
    })
    .addCase(createPostResponseAsync.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  }
})

export const { clearPosts, clearSelectedPost } = groupPostSlice.actions;

export default groupPostSlice.reducer;

export {
  createGroupPostAsync,
  getAllGroupPostsAsync,
  getOneGroupPostAsync,
  createPostResponseAsync,
}
