import { use, useEffect  } from 'react';
import {selectAllPosts,incrementReaction,Reaction ,addNewPost , getSubmitStatus, getPostsStatus,getPostsError , fetchPosts} from './postSlice';
import { useSelector , useDispatch } from 'react-redux';
import {useForm, Controller} from 'react-hook-form';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { addPost} from './postSlice'



export default function Post() {
    const allPosts = useSelector(selectAllPosts);
     const { handleSubmit, control, formState: { errors } } = useForm();
    const dispatch = useDispatch();

    const postStatus = useSelector(getPostsStatus);
    const error = useSelector(getPostsError);
    const submitStatus = useSelector(getSubmitStatus);

    useEffect(() => {
        if (postStatus === 'idle') {
            dispatch(fetchPosts())
        }
    }, [postStatus, dispatch])

    

    const onSubmit = (data)=> {
        // dispatch(addPost(data.title, data.content));
        dispatch(addNewPost(data));
    }

    
    const renderPosts = () => {
      return (
        <div>
          <h2>Posts</h2>
          {
        allPosts.map((post) => (
          <article key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            {/* <div> */}
              {/* <span onClick={() => dispatch(incrementReaction({ postId: post.id, reaction: Reaction.thumbsUp }))}>👍 {post.reactions.thumbsUp}</span>
              <span onClick={() => dispatch(incrementReaction({ postId: post.id, reaction: Reaction.wow }))}>😮 {post.reactions.wow}</span>
              <span onClick={() => dispatch(incrementReaction({ postId: post.id, reaction: Reaction.heart }))}>❤️ {post.reactions.heart}</span>
              <span onClick={() => dispatch(incrementReaction({ postId: post.id, reaction: Reaction.rocket }))}>🚀 {post.reactions.rocket}</span>
              <span onClick={() => dispatch(incrementReaction({ postId: post.id, reaction: Reaction.coffee }))}>☕ {post.reactions.coffee}</span>
            </div> */}
          </article>
        ))
          }
        </div>
      );
    }

    if (postStatus === 'loading') {
        return <p>"Loading..."</p>
    } 

    if( postStatus === 'failed') {
      return <p>Error: {error}</p>
    }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller 
          name="title"
          control={control}
          defaultValue=""
          rules={{ required: 'Title is required', maxLength: { value: 100, message: 'Title cannot exceed 100 characters' } }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Title"
              variant="outlined"
              fullWidth
              error={!!errors.title}
              helperText={errors.title ? errors.title.message : ''}
            />
          )}
        />

        <Controller
          name="content"
          control={control}
          defaultValue=""
          rules={{ required: 'Content is required', minLength: { value: 10, message: 'Content must be at least 10 characters' } }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Content"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              error={!!errors.content}
              helperText={errors.content ? errors.content.message : ''}
            />
          )}
            
          />

        {submitStatus === 'loading' && <p>Submitting...</p>}
        {submitStatus === 'failed' && <p>Error submitting post</p>}
        {submitStatus === 'succeeded' && <p>Post submitted successfully!</p>}

      <Button type="submit" variant="contained" color="primary" disabled={submitStatus === 'pending'}>
          Submit
        </Button>

      </form>
      {allPosts.length ? renderPosts() : <p>No posts available</p>}
    </>
  );
}
