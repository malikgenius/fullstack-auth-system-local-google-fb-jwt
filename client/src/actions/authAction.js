import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';
import { GET_ERRORS, GET_USER, LOGIN_USER, SET_CURRENT_USER } from './types';

// can use Dispatch in same functions, other way is to use axios in one function and then dispatch to other one.
export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/api/users/register', userData)
    .then(
      res => history.push('/verifytoken')
      // if successful registration we send our users to verification page or login page via history withRouter props.
      //   dispatch({
      //     type: GET_USER,
      //     payload: res.data
      //   })
    )
    // if errors form backend linke status(400) or status(404) etc will directly go to GET_ERRORS, AXIOS knows how to handle it.
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Verification Email Process ....

export const verificationEmail = (Token, history) => dispatch => {
  axios
    .post('/api/users/verifytoken', Token)
    .then(res => history.push('/'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// SET_CURRENT_USER after Login Successful and decoded token is retrieved from loginUser action function.
export const setCurrentUser = decoded => ({
  type: SET_CURRENT_USER,
  payload: decoded
});
// Login Local user ..
export const loginUser = userData => dispatch => {
  axios
    .post('/api/users/login', userData)
    .then(res => {
      const { token } = res.data;
      console.log(token);
      // save token to localstorage
      localStorage.setItem('jwtToken', token);
      // set it to Auth Header
      setAuthToken(token);
      // Decode Token with jwt-decode and add it to user object in redux store.
      const decoded = jwt_decode(token);
      // set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};
// GOOGLE USER LOGIN ..
export const loginSocialUser = token => dispatch => {
  //   return console.log(token);
  // save token to localstorage
  localStorage.setItem('jwtToken', token);
  // set it to Auth Header
  setAuthToken(token);
  // Decode Token with jwt-decode and add it to user object in redux store.
  const decoded = jwt_decode(token);
  // set current user
  dispatch(setCurrentUser(decoded));
};

export const logoutUser = history => dispatch => {
  localStorage.removeItem('jwtToken');
  setAuthToken(false);
  dispatch(setCurrentUser({}));
  history.push('/');
};

export const loginGoogle = (accessToken, history) => dispatch => {
  axios
    .post('/api/users/google', accessToken)
    .then(
      res => console.log(res.data)
      //   dispatch({
      //     type: LOGIN_USER,
      //     payload: res.data
      //   })
    )
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};
