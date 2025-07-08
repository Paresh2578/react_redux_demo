import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = [
    {
        id: '1',
        title: 'Learning Redux Toolkit',
        content: "I've heard good things.",
        // date: sub(new Date(), { minutes: 10 }).toISOString(),
        reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
        }
    },
    {
        id: '2',
        title: 'Slices...',
        content: "The more I say slice, the more I want pizza.",
        // date: sub(new Date(), { minutes: 5 }).toISOString(),
        reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
        }
    }
];




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
        }
    }
});

class Reaction{
    static thumbsUp = 'thumbsUp';
    static wow = 'wow';
    static heart = 'heart';
    static rocket = 'rocket';
    static coffee = 'coffee';
}


export const selectAllPosts = (state) => state.posts;

export const { addPost , incrementReaction} = postSlice.actions;

export { Reaction };


export default postSlice.reducer;