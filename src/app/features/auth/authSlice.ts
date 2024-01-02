import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const Activities = localStorage.getItem("activities");

export type Activity = {
  id: string;
  name: string;
  duration: string;
};

const AuthSlice = createSlice({
  name: "activities",
  initialState: Activities ? JSON.parse(Activities) : [],
  reducers: {
    createActivity: (state, action: PayloadAction<Activity>) => {
      const newActivities = [...state, action.payload];
      localStorage.setItem("activities", JSON.stringify(newActivities));
      state.push(action.payload);
    },
    deleteActivity: (state, action: PayloadAction<Activity>) => {
      const newActivities = state.filter((act: Activity) => {
        return act.id !== action.payload.id;
      });
      localStorage.setItem("activities", JSON.stringify(newActivities));
      return state.filter((act: Activity) => {
        return act.id !== action.payload.id;
      });
    },
  },
});

export const { createActivity, deleteActivity } = AuthSlice.actions;

export default AuthSlice.reducer;
