/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

interface IApiKey {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  active: boolean;
}

interface IApiKeyState {
  apiKeys: IApiKey[];
  selectedApiKey: string;
}

const initialState: IApiKeyState = {
  apiKeys: [],
  selectedApiKey: "",
};

const ApiKeySlice = createSlice({
  name: "api-key",
  initialState: initialState,
  reducers: {
    setSelectedApiKey: (state, action) => {
      return {
        ...state,
        selectedApiKey: action.payload,
      };
    },
    setApiKeys: (state, action) => {
      return {
        ...state,
        apiKeys: action.payload,
      };
    },
  },
});

export const { setSelectedApiKey, setApiKeys } = ApiKeySlice.actions;

export default ApiKeySlice.reducer;
