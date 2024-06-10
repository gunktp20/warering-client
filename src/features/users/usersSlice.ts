/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { IUserState } from "./types";

const initialState: IUserState = {
  users: [],
};

const UsersSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {
    setUsers: (state, action) => {
      return { ...state, users: action.payload };
    },
  },
});

export const { setUsers } = UsersSlice.actions;

export default UsersSlice.reducer;
