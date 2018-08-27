import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { loginUser } from '../actions/authAction';
import './bootStrapLogin2.css';

class BootStrapLogin2 extends Component {
  constructor(props) {
    super(props);
    // console.log(props);
    this.state = {
      email: '',
      password: '',
      errors: ''
    };
  }

  componentDidMount = () => {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors.error });
    }
  };
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const User = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(User);
  };

  render() {
    // const { errors } = this.state;
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
              {/* <Input
                type="email"
                name="email"
                id="exampleEmail"
                placeholder="with a placeholder"
              /> */}
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
            {this.state.errors ? (
              <div className="text-center small red" style={{ color: 'red' }}>
                {this.state.errors}
              </div>
            ) : (
              ''
            )}
            <div className="text-center small">
              <Link to="/forgot">Forgot Your password?</Link>
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
// export default BootStrapLogin2;
const mapStateToProps = (state, ownProps) => {
  return {
    auth: state.auth,
    errors: state.errors
  };
};
export default connect(
  mapStateToProps,
  { loginUser }
)(BootStrapLogin2);
