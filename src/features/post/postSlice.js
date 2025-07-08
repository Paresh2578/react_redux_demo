import { createSlice, nanoid , createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const POSTS_URL = 'https://686cabd814219674dcc8b1e4.mockapi.io/post';

const initialState = {
    posts: [],
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    submitStatus: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await axios.get(POSTS_URL);
    return response.data;
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
    const response = await axios.post(POSTS_URL, initialPost);
    return response.data;
});

const postSlice = createSlice({
    name : 'posts',
    initialState,
    reducers: {
        addPost : {
            reducer(state,action){
                state.push(action.payload);
            },
            prepare(title,content){
               return {
                payload : {
                    id : nanoid(),
                    title,
                    content,
                }
               }   
            }
        },
        incrementReaction : (state, action) =>  {
            const { postId, reaction } = action.payload;
            const existingPost = state.find(post => post.id === postId);
            if (existingPost) {
                existingPost.reactions[reaction]++;
            }
        },
    },
        extraReducers(builder) {
            builder
                .addCase(fetchPosts.pending, (state, action) => {
                    state.status = 'loading';
                })
                .addCase(fetchPosts.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    // Add any fetched posts to the array
                    state.posts = state.posts.concat(action.payload);
                })
                .addCase(fetchPosts.rejected, (state, action) => {
                    state.status = 'failed';
                    state.error = action.error.message;
                }).addCase(addNewPost.pending, (state, action) => {
                    state.submitStatus = 'loading';
                }).addCase(addNewPost.fulfilled, (state, action) => {
                    state.submitStatus = 'succeeded';
                    // Add the new post to the array
                    state.posts.push(action.payload);
                }).addCase(addNewPost.rejected, (state, action) => {
                    state.submitStatus = 'failed';
                    state.error = action.error.message;
                });
        }
});

class Reaction{
    static thumbsUp = 'thumbsUp';
    static wow = 'wow';
    static heart = 'heart';
    static rocket = 'rocket';
    static coffee = 'coffee';
}


export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getSubmitStatus = (state) => state.posts.submitStatus;

export const { addPost , incrementReaction} = postSlice.actions;

export { Reaction };


export default postSlice.reducer;