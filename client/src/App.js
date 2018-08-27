import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Set Current User persist
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authAction';
import { Provider } from 'react-redux';
import configureStore from './reducers';
import createHistory from 'history/createBrowserHistory';
import GoogleOauth from './Login/GoogleOauth';
import FacebookOauth from './Login/FacebookOauth';
import BootStrapLogin2 from './Login/bootStrapSocialLogin2';
import BootStrapSignUp2 from './Login/bootStrapSignUp2';
import VerifyToken from './verifyReset/VerifyToken';
import ResetPassword from './verifyReset/resetPassword';
import ChangePassword from './verifyReset/ChangePassword';
import EmailVerified from './verifyReset/EmailVerified';
import Header from './Login/Header';
import DashBoard from './Components/Dashboard';
// export const history = createHistory();
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
  // check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = '/';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Header />
            <Switch>
              <Route exact path="/" component={BootStrapLogin2} />
              <Route path="/signup" component={BootStrapSignUp2} />
              <Route path="/facebook" component={FacebookOauth} />
              <Route path="/google" component={GoogleOauth} />
              <Route path="/verifytoken" component={VerifyToken} />
              <Route path="/emailverified" component={EmailVerified} />
              <Route path="/forgot" component={ResetPassword} />
              <Route path="/changepassword" component={ChangePassword} />
              <Route path="/dashboard" component={DashBoard} />
              {/* <Route path="/header" component={Header} /> */}
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
