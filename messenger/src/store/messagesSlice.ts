import { createSlice } from '@reduxjs/toolkit';

interface Message {
    sender: string;
    text: string;
    time: string;
    isError?: boolean;
}

const initialState: Message[] = [];

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage(state, action) {
            state.push(action.payload);
        },
        removeMessage(state, action) {
            return state.filter((message) => message.time !== action.payload);
        },
    },
});

export const { addMessage } = messagesSlice.actions;
export const messagesReducer = messagesSlice.reducer;
