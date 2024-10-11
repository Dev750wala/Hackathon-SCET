import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserDataInStore } from "@/interfaces";


export const userInfoSlice = createSlice({
    name: 'user',
    initialState: null as UserDataInStore | null,
    reducers: {
        setUser: (_state, action: PayloadAction<UserDataInStore>) => action.payload,
        removeUser: () => null
    }
})

export const { setUser, removeUser } = userInfoSlice.actions
export default userInfoSlice.reducer