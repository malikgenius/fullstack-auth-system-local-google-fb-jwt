import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import authReducer from './authReducer';
import errorReducer from './errorReducer';

export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      errors: errorReducer
    }),
    composeWithDevTools(applyMiddleware(thunk))
  );

  return store;
};
