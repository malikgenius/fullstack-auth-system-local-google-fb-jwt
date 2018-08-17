import React, { Component } from 'react';
import './bootStrapSocialLogin.css';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import clientId from '../config/Keys';
import googleClientId from '../config/Keys';
import axios from 'axios';
import { Link } from 'react-router-dom';

class BootStrapLogin extends Component {
  render() {
    // Facebook Response function to get Token and forward to API.
    const responseFacebook = response => {
      const access_token = response.accessToken;
      // console.log(JSON.stringify({ access_token: responseFacebook }));
      axios.post('/api/users/facebook', { access_token }).then(res => {
        console.log('AXIOS RES', res);
      });
    };

    const responseGoogle = response => {
      console.log(response);
      const access_token = response.Zi.access_token;
      console.log(JSON.stringify({ access_token: access_token }));
      console.log(access_token);
      axios.post('/api/users/google', { access_token }).then(res => {
        console.log(res);
      });
    };

    return (
      <div class="login-form">
        <form>
          <h2 class="text-center">Sign in </h2>
          <div class="text-center social-btn">
            <Link to="/facebook" class="btn btn-primary btn-block">
              <i class="fa fa-facebook" /> Sign in with <b>Facebook</b>
            </Link>

            <Link to="/google" class="btn btn-danger btn-block">
              <i class="fa fa-google" /> Sign in with <b>Google</b>
            </Link>
          </div>
          <div class="or-seperator">
            <i>or</i>
          </div>
          <div class="form-group">
            <div class="input-group">
              <span class="input-group-addon">
                <i class="fa fa-user" />
              </span>
              <input
                type="text"
                class="form-control"
                name="username"
                placeholder="Username"
                required="required"
              />
            </div>
          </div>
          <div class="form-group">
            <div class="input-group">
              <span class="input-group-addon">
                <i class="fa fa-lock" />
              </span>
              <input
                type="password"
                class="form-control"
                name="password"
                placeholder="Password"
                required="required"
              />
            </div>
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-success btn-block login-btn">
              Sign in
            </button>
          </div>
          <div class="clearfix">
            <label class="pull-left checkbox-inline">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" class="pull-right text-success">
              Forgot Password?
            </a>
          </div>
        </form>
        <div class="hint-text small">
          Don't have an account?{' '}
          <a href="#" class="text-success">
            Register Now!
          </a>
        </div>
      </div>
    );
  }
}

export default BootStrapLogin;
