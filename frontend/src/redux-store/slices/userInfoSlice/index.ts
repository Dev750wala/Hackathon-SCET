import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/interfaces";


export const userInfoSlice = createSlice({
    name: 'user',
    initialState: null as User | null,
    reducers: {
        setUser: (_state, action: PayloadAction<User>) => action.payload,
        removeUser: () => null
    }
})

export const { setUser, removeUser } = userInfoSlice.actions
export default userInfoSlice.reducer