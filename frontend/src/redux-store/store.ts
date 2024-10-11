import { configureStore } from "@reduxjs/toolkit";
import { userInfoSlice } from "./slices/userInfoSlice";
import { adminSlice } from "./slices/adminSlice";

export const store = configureStore({
    reducer: {
        userInfo: userInfoSlice.reducer,
        admin: adminSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
