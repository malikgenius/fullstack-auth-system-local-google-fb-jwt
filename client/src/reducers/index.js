import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import successReducer from './successReducer';

export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      errors: errorReducer,
      success: successReducer
    }),
    composeWithDevTools(applyMiddleware(thunk))
  );

  return store;
};
