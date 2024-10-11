import { createSlice } from "@reduxjs/toolkit";

export const adminSlice = createSlice({
    name: 'admin',
    initialState: false,
    reducers: {
        setAdmin: () => true,
        removeAdmin: () => false,
    }
})

export const { setAdmin, removeAdmin } = adminSlice.actions;
export default adminSlice.reducer;