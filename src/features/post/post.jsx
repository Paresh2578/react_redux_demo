import { use, useEffect } from 'react';
import {selectAllPosts} from './postSlice';
import { useSelector } from 'react-redux';
import {useForm, Controller} from 'react-hook-form';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function Post() {
    const allPosts = useSelector(selectAllPosts);
     const { handleSubmit, control, formState: { errors } } = useForm();

    const onSubmit = (data)=> {
       console.log('Form submitted', data);
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
                <div>
                  <span>👍 {post.reactions.thumbsUp}</span>
                  <span>😮 {post.reactions.wow}</span>
                  <span>❤️ {post.reactions.heart}</span>
                  <span>🚀 {post.reactions.rocket}</span>
                  <span>☕ {post.reactions.coffee}</span>
                </div>
              </article>
            ))
          }
        </div>
      );
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

      <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>

      </form>
      {allPosts.length ? renderPosts() : <p>No posts available</p>}
    </>
  );
}
