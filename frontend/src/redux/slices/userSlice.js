/* eslint-disable no-return-await */
/* eslint-disable no-return-assign */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UserApi } from '../../actions/userAction';
import { dispatch } from '../store';

export const userRegister = createAsyncThunk('user/register', async (user) => await UserApi.register(user));
export const fetchUsersList = createAsyncThunk('user/listUsers', async () => {
  const result = await UserApi.getUsers();
  return result;
});

const initialState = {
  currentUser: null,
  users: [],
  loading: false,
  step: false,
  error: null,
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.currentUser = action.payload;
      state.step = false;
    },
    createUserList: (state, action) => {
      state.users.push(action.payload);
    },
    addUserList: (state, action) => {
      state.users = action.payload;
    },
    updateUserFromList: (state, action) => {
      state.users = state.users.map((item) => {
        item._id === action.payload._id ? action.payload : item;
      });
    },
    startLoading(state) {
      state.step = true;
    },
    hasError(state, action) {
      state.step = false;
      state.error = action.payload;
    },
    removeUserFromList: (state, action) => {
      state.users = state.users.filter((item) => item._id !== action.payload._id);
    },
    updateCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userRegister.pending, (state) => (state.loading = true))
      .addCase(userRegister.fulfilled, (state) => (state.loading = false))
      .addCase(fetchUsersList.pending, (state) => (state.loading = true))
      .addCase(fetchUsersList.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(updateCurrentUser, (state, action) => {
        state.currentUser = action.payload;
      });
  },
});

export const { addUser, createUserList, updateUserFromList, removeUserFromList, addUserList, updateCurrentUser } =
  userSlice.actions;
export default userSlice.reducer;

// ----------------------------------------------------------------------

export function updateUserProfilling(userId, updatedProfilling) {
  return async () => {
    dispatch(userSlice.actions.startLoading());
    try {
      const response = await UserApi.editUserProfilling(userId, updatedProfilling);
      dispatch(userSlice.actions.addUser(response));
    } catch (error) {
      dispatch(userSlice.actions.hasError(error));
    }
  };
}
