import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import authReducer from './authReducer';

export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer
    }),
    composeWithDevTools(applyMiddleware(thunk))
  );

  return store;
};
