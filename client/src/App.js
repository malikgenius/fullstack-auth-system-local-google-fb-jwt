import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import GoogleOauth from './Login/GoogleOauth';
import FacebookOauth from './Login/FacebookOauth';
import BootStrapLogin2 from './Login/bootStrapSocialLogin2';
import BootStrapSignUp2 from './Login/bootStrapSignUp2';
import VerifyToken from './verifyReset/VerifyToken';
export const history = createHistory();

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={BootStrapLogin2} />
          <Route path="/signup" component={BootStrapSignUp2} />
          <Route path="/facebook" component={FacebookOauth} />
          <Route path="/google" component={GoogleOauth} />
          <Route path="/verifytoken" component={VerifyToken} />
        </div>
      </Router>
    );
  }
}

export default App;
