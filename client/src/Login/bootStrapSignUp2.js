import React, { Component } from 'react';
// import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../actions/authAction';
import './bootStrapLogin2.css';

class BootStrapSignUp2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      errors: ''
    };
  }
  componentDidMount = () => {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.errors) {
      console.log(nextProps.errors);
      this.setState({ errors: nextProps.errors.error });
    }
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    // console.log(e);
    // confirm password match test ..
    if (this.state.password !== this.state.password2) {
      return this.setState({ errors: 'Passwords do not match' });
    }
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    // we can take our history to Action through this way, its different than Andrew Mead React way.
    this.props.registerUser(newUser, this.props.history);
    // axios
    //   .post('/api/users/register', {
    //     name: newUser.name,
    //     email: newUser.email,
    //     password: newUser.password
    //   })
    //   .then(res => {
    //     console.log(res.data);
    //   })

    //   .catch(err => this.setState({ errors: err.response.data }));
    // console.log(this.state.errors);
    // {
    //   console.log({ errors: err.response.data });
    // }
    // );
    // console.log(newUser);
  };

  render() {
    const { errors } = this.state;
    return (
      <div>
        <div className="signin-form">
          <form onSubmit={this.onSubmit}>
            <h2>Sign Up</h2>
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
            <div className="text-center small">Create new Account</div>
            <br />
            <div className="form-group">
              <input
                type="text"
                className="form-control input-lg"
                name="name"
                value={this.state.name}
                onChange={this.onChange}
                placeholder="Full Name"
                required="required"
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-control input-lg"
                name="email"
                value={this.state.email}
                onChange={this.onChange}
                placeholder="Email Address"
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
              <input
                type="password"
                className="form-control input-lg"
                name="password2"
                value={this.state.password2}
                onChange={this.onChange}
                placeholder="Confirm Password"
                required="required"
              />
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="btn btn-success btn-lg btn-block signup-btn"
              >
                Sign Up
              </button>
            </div>
            {errors ? (
              <div className="text-center small red" style={{ color: 'red' }}>
                {errors}
              </div>
            ) : (
              ''
            )}
            <div className="text-center small">
              <a href="#">Forgot Your password?</a>
            </div>
          </form>
          <div className="text-center small">
            Already have an account? <Link to="/">Sign in</Link>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    auth: state.auth,
    errors: state.errors
  };
};

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(BootStrapSignUp2));
// we can take our history to Action through withRouter, its different than Andrew Mead React way.
