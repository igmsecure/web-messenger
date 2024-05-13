import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { messagesReducer } from './messagesSlice';
import userReducer from './authSlice';


const rootReducer = combineReducers({
    auth: userReducer,
    messages: messagesReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default store;
