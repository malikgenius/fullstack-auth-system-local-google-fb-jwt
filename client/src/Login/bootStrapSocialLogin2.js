import React, { Component } from 'react';
import './bootStrapSocialLogin2.css';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import clientId from '../config/Keys';
import googleClientId from '../config/Keys';
import axios from 'axios';
import { Link } from 'react-router-dom';

class BootStrapLogin2 extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: ''
    };
  }

  onChange = e => {
    const value = e.target.value;
    console.log(e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const User = {
      email: this.state.email,
      password: this.state.password
    };
    axios
      .post('/api/users/login', { email: User.email, password: User.password })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log({ error: err });
      });
  };

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
      <div>
        <div className="signin-form">
          <form onSubmit={this.onSubmit}>
            <h2>Sign in</h2>
            <p className="hint-text">Sign in with your social media account</p>
            <div className="social-btn text-center">
              <Link
                to="/facebook"
                className="btn btn-primary btn-lg"
                title="Facebook"
              >
                <i className="fa fa-facebook" />
              </Link>

              <Link
                to="/google"
                className="btn btn-danger btn-lg"
                title="Google"
              >
                <i className="fa fa-google" />
              </Link>
            </div>
            <div className="or-seperator">
              <b>or</b>
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control input-lg"
                name="email"
                value={this.state.email}
                onChange={this.onChange}
                placeholder="email"
                required="required"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control input-lg"
                name="password"
                value={this.state.password}
                onChange={this.onChange}
                placeholder="Password"
                required="required"
              />
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="btn btn-success btn-lg btn-block signup-btn"
              >
                Sign in
              </button>
            </div>
            <div className="text-center small">
              <a href="#">Forgot Your password?</a>
            </div>
          </form>
          <div className="text-center small">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default BootStrapLogin2;
