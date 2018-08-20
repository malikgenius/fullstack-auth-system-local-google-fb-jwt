import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './reducers';
import createHistory from 'history/createBrowserHistory';
import GoogleOauth from './Login/GoogleOauth';
import FacebookOauth from './Login/FacebookOauth';
import BootStrapLogin2 from './Login/bootStrapSocialLogin2';
import BootStrapSignUp2 from './Login/bootStrapSignUp2';
import VerifyToken from './verifyReset/VerifyToken';
export const history = createHistory();

// Store

class App extends Component {
  render() {
    const store = configureStore();
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Route exact path="/" component={BootStrapLogin2} />
            <Route path="/signup" component={BootStrapSignUp2} />
            <Route path="/facebook" component={FacebookOauth} />
            <Route path="/google" component={GoogleOauth} />
            <Route path="/verifytoken" component={VerifyToken} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
