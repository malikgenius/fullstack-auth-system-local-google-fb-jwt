import { GET_SUCCESS } from '../actions/types';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SUCCESS:
      return {
        ...state,
        success: action.payload
      };
    default: {
      return state;
    }
  }
};
