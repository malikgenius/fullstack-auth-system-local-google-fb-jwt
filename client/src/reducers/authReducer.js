import isEmpty from '../validation/is-empty.js';
import { GET_USER, SET_CURRENT_USER } from '../actions/types';
const initialState = { isAuthenticated: false, user: {} };

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        user: action.payload
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    default:
      return state;
  }
};
