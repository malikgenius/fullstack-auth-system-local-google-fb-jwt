import React, { Component } from 'react';
import './bootStrapLogin2.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

class VerificationToken extends Component {
  constructor() {
    super();
    this.state = {
      token: ''
    };
  }

  onChange = e => {
    const value = e.target.value;
    console.log(e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const Token = {
      token: this.state.token
    };
    // return console.log(Token);
    axios
      .post('/api/users/verifytoken', { token: Token.token })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log({ error: err });
      });
  };

  render() {
    return (
      <div>
        <div className="signin-form">
          <div className="alert alert-light" role="alert" size="large">
            <h4>please check your email for verification Token,</h4>
          </div>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-control input-lg"
                name="token"
                value={this.state.email}
                onChange={this.onChange}
                placeholder="verification code"
                required="required"
              />
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="btn btn-success btn-lg btn-block signup-btn"
              >
                Verify
              </button>
            </div>
            <div className="text-center small">
              <a href="#">resend verification code</a>
            </div>
            <div className="text-center small">
              <Link to="/">Log in</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default VerificationToken;