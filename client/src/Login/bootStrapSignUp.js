import React, { Component } from 'react';
import './bootStrapSignUp.css';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import clientId from '../config/Keys';
import googleClientId from '../config/Keys';
import axios from 'axios';
import { Link } from 'react-router-dom';

class BootStrapSignUp extends Component {
  render() {
    return (
      <div>
        <div class="signup-form">
          <form
            action="/examples/actions/confirmation.php"
            method="post"
            class="form-horizontal"
          >
            <div class="col-xs-8 col-xs-offset-4">
              <h2>Sign Up</h2>
            </div>

            <div class="form-group">
              <label class="control-label col-xs-4">Username</label>
              <div class="col-xs-8">
                <input
                  type="text"
                  class="form-control"
                  name="username"
                  required="required"
                />
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-xs-4">Email Address</label>
              <div class="col-xs-8">
                <input
                  type="email"
                  class="form-control"
                  name="email"
                  required="required"
                />
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-xs-4">Password</label>
              <div class="col-xs-8">
                <input
                  type="password"
                  class="form-control"
                  name="password"
                  required="required"
                />
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-xs-4">Confirm Password</label>
              <div class="col-xs-8">
                <input
                  type="password"
                  class="form-control"
                  name="confirm_password"
                  required="required"
                />
              </div>
            </div>
            <div class="form-group">
              <div class="col-xs-8 col-xs-offset-4">
                <p>
                  <label class="checkbox-inline">
                    <input type="checkbox" required="required" /> I accept the{' '}
                    <a href="#">Terms of Use</a> &amp;{' '}
                    <a href="#">Privacy Policy</a>.
                  </label>
                </p>
                <button type="submit" class="btn btn-primary btn-lg">
                  Sign Up
                </button>
              </div>
            </div>
          </form>
          <div class="text-center">
            Already have an account? <a href="#">Login here</a>
          </div>
        </div>
      </div>
    );
  }
}

export default BootStrapSignUp;
