import axios from 'axios';
import { POST_LOADING, GET_POSTS, GET_POST, ADD_POST, DELETE_POST, GET_ERRORS } from '../actions/types';

// Add Post
export const addPost = postData => dispatch => {
    axios.post('/api/posts', postData)
        .then(res => {
            dispatch({
                type: ADD_POST,
                payload: res.data
            });
            dispatch(clearErrors());
        })
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }));
}

//Get Posts
export const getPosts = () => dispatch => {
    dispatch(setPostLoading());
    axios.get('/api/posts')
        .then(res => dispatch({
            type: GET_POSTS,
            payload: res.data
        }))
        .catch(err => dispatch({
            type: GET_POSTS,
            payload: null
        }));
}

// Set loading state
export const setPostLoading = () => ({
    type: POST_LOADING
});

// Clear errors
export const clearErrors = () => ({
    type: GET_ERRORS,
    payload: {}
});
