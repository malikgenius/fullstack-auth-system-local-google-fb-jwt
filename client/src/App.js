import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// Set Current User persist
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser } from './actions/authAction';
import { Provider } from 'react-redux';
import configureStore from './reducers';
import createHistory from 'history/createBrowserHistory';
import GoogleOauth from './Login/GoogleOauth';
import FacebookOauth from './Login/FacebookOauth';
import BootStrapLogin2 from './Login/bootStrapSocialLogin2';
import BootStrapSignUp2 from './Login/bootStrapSignUp2';
import VerifyToken from './verifyReset/VerifyToken';
import Navbar from './Login/navbar';
export const history = createHistory();
// Store
const store = configureStore();

// check for user
if (localStorage.jwtToken) {
  //Set Auth token header auth setAuthToken function makes sure that Authorization Headers have the token.
  // if we dont do this, token will be in localStorage only but not in headers to verify with backend.
  setAuthToken(localStorage.jwtToken);
  // decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Route exact path="/" component={BootStrapLogin2} />
            <Route path="/signup" component={BootStrapSignUp2} />
            <Route path="/facebook" component={FacebookOauth} />
            <Route path="/google" component={GoogleOauth} />
            <Route path="/verifytoken" component={VerifyToken} />
            <Route path="/dashboard" component={Navbar} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
