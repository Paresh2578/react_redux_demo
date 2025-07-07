import postReducer from '../features/post/postSlice';
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        posts : postReducer
    },
});