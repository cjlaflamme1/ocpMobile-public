import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createGroup, getAllGroups, getOneGroup, getUserGroups, updateGroup } from '../api/groupAPI';
import { createGroupInvites, getAllInvitations, updateGroupInvite } from '../api/groupInvitationAPI';
import { QueryObject } from '../models/QueryObject';
import { User } from './userSlice';

export interface CreateGroupInviteDto {
  message?: string;
  invitedUserId: string;
  invitedById: string;
  groupId: string;
}

export interface CreateGroupDto {
  coverPhoto: string | null;
  title: string;
  location?: string;
  description: string;
  groupAdminIds: string[];
  pendingInvitationUserIds?: string[];
}

export interface UpdateGroupDto extends Partial<Group> {
  addingUserIds?: string[];
  addingAdminIds?: string[];
  removeUserIds?: string[];
  blockUserIds?: string[];
}

export interface GroupInvitation {
  id: string;
  accepted: boolean;
  message: string;
  viewed: boolean;
  invitedUser: User;
  group: Group;
  invitedBy: User;
}

export interface Group {
  id: string;
  coverPhoto: string;
  title: string;
  location?: string;
  description: string;
  groupAdmins: User[];
  users: User[];
  pendingInvitations: GroupInvitation[];
  imageGetUrl?: string;
}

interface GroupState {
  allGroups: {
    groups: Group[] | null;
    count: number;
  };
  searchForGroups: {
    groups: Group[] | null;
    count: number;
  };
  allInvitations: GroupInvitation[] | null;
  selectedGroup: Group | null;
  status: 'idle' | 'loading' | 'failed';
  error: any;
}

const initialState: GroupState = {
  allGroups: {
    groups: null,
    count: 0,
  },
  searchForGroups: {
    groups: null,
    count: 0,
  },
  allInvitations: null,
  selectedGroup: null,
  status: 'idle',
  error: null,
}

const createGroupAsync = createAsyncThunk(
  'group/create',
  async (arg: CreateGroupDto, { rejectWithValue }) => {
    try {
      const response: any = await createGroup(arg);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const getAllGroupsAsync = createAsyncThunk(
  'group/getAll',
  async (arg: QueryObject, { rejectWithValue }) => {
    try {
      const response: any = await getAllGroups(arg);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const getAllUserGroupsAsync = createAsyncThunk(
  'group/getUserGroups',
  async (arg: QueryObject, { rejectWithValue }) => {
    try {
      const response: any = await getUserGroups(arg);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const getOneGroupAsync = createAsyncThunk(
  'group/getOneGroup',
  async (id: string, { rejectWithValue }) => {
    try {
      const response: any = await getOneGroup(id);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const getAllInvitationsAsync = createAsyncThunk(
  'group/getAllInvitations',
  async (arg, { rejectWithValue }) => {
    try {
      const response: any = await getAllInvitations();
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const updateGroupInviteAsync = createAsyncThunk(
  'group/updateInvitation',
  async (arg: { id: string, body: Partial<GroupInvitation>}, { rejectWithValue }) => {
    try {
      const response: any = await updateGroupInvite(arg.id, arg.body);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const createGroupInvitesAsync = createAsyncThunk(
  'group/createInvitations',
  async (arg: { groupid: string, userIds: string[] }, { rejectWithValue }) => {
    try {
      const response: any = await createGroupInvites(arg);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const updateGroupAsync = createAsyncThunk(
  'group/updateGroup',
  async (arg: { id: string, body: UpdateGroupDto }, { rejectWithValue }) => {
    try {
      const response: any = await updateGroup(arg.id, arg.body);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  }
)

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    clearGroupList(state) {
      state.allGroups = {
        groups: [],
        count: 0,
      };
    },
    clearSelectedGroup(state) {
      state.selectedGroup = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllGroupsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllGroupsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.searchForGroups = action.payload;
        state.error = null;
      })
      .addCase(getAllGroupsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.searchForGroups = {
          groups: [],
          count: 0,
        };
        state.error = action.payload;
      })
      .addCase(getAllUserGroupsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllUserGroupsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.allGroups = action.payload;
        state.error = null;
      })
      .addCase(getAllUserGroupsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.allGroups = {
          groups: [],
          count: 0,
        };
        state.error = action.payload;
      })
      .addCase(createGroupAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createGroupAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.selectedGroup = action.payload;
        state.error = null;
      })
      .addCase(createGroupAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.selectedGroup = null;
        state.error = action.payload;
      })
      .addCase(getOneGroupAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getOneGroupAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.selectedGroup = action.payload;
        state.error = null;
      })
      .addCase(getOneGroupAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.selectedGroup = null;
        state.error = action.payload;
      })
      .addCase(getAllInvitationsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllInvitationsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.allInvitations = action.payload;
        state.error = null;
      })
      .addCase(getAllInvitationsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.allInvitations = null;
        state.error = action.payload;
      })
      .addCase(updateGroupInviteAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateGroupInviteAsync.fulfilled, (state) => {
        state.status = 'idle';
        state.error = null;
      })
      .addCase(updateGroupInviteAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateGroupAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateGroupAsync.fulfilled, (state) => {
        state.status = 'idle';
        state.error = null;
      })
      .addCase(updateGroupAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createGroupInvitesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createGroupInvitesAsync.fulfilled, (state) => {
        state.status = 'idle';
        state.error = null;
      })
      .addCase(createGroupInvitesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
})

export const { clearGroupList, clearSelectedGroup } = groupSlice.actions;

export default groupSlice.reducer;

export {
  getAllGroupsAsync,
  createGroupAsync,
  getAllUserGroupsAsync,
  getOneGroupAsync,
  getAllInvitationsAsync,
  updateGroupInviteAsync,
  updateGroupAsync,
  createGroupInvitesAsync,
}
