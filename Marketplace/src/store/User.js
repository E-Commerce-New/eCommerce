import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    user: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload ;
        },
        clearUserInfo: (state) => {
            state.user = null;
        },
    },
});

export const {setUser, clearUserInfo} = userSlice.actions;
export default userSlice.reducer;
