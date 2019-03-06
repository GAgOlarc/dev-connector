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
export const getPosts = (load = true) => dispatch => {
    if (load) dispatch(setPostLoading());
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

//Get Post
export const getPost = (id) => dispatch => {
    dispatch(setPostLoading());
    axios.get('/api/posts/' + id)
        .then(res => dispatch({
            type: GET_POST,
            payload: res.data
        }))
        .catch(err => dispatch({
            type: GET_POST,
            payload: null
        }));
}

// Add comment
export const addComment = (postId, newComment) => dispatch => {
    axios.post('/api/posts/comment/' + postId, newComment)
        .then(res => {
            dispatch({
                type: GET_POST,
                payload: res.data
            });
            dispatch(clearErrors());
        })
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }));
}

// Delete Post
export const deletePost = id => dispatch => {
    axios.delete('/api/posts/' + id)
        .then(res => 
            dispatch({
                type: DELETE_POST,
                payload: id
            })
        )
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }));
}

// Like Post
export const addLike = id => dispatch => {
    axios.post('/api/posts/like/' + id)
        .then(res => dispatch(getPosts(false)))
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }));
}

// Remove Like
export const removeLike = id => dispatch => {
    axios.post('/api/posts/unlike/' + id)
        .then(res => dispatch(getPosts(false)))
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
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
