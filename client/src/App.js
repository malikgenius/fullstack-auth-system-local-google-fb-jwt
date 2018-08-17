import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import GoogleOauth from './Login/GoogleOauth';
import FacebookOauth from './Login/FacebookOauth';
import BootStrapLogin from './Login/bootStrapSocialLogin';
import BootStrapLogin2 from './Login/bootStrapSocialLogin2';
import BootStrapSignUp2 from './Login/bootStrapSignUp2';
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
        </div>
      </Router>
    );
  }
}

export default App;
