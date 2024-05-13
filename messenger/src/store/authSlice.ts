import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: string;
    username: string;
}

interface AuthState {
    user: User | null;
}

const initialState: AuthState = {
    user: null,
};

const userReducer = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
        removeUser(state) {
            state.user = null;
        },
    },
});

export const { addUser, removeUser } = userReducer.actions;
export default userReducer.reducer;
