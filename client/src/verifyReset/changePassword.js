import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { changePassword } from '../actions/authAction';
// import './bootStrapLogin2.css';

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    // console.log(props);
    this.state = {
      password: '',
      password2: '',
      errors: ''
    };
  }

  // componentDidMount = () => {
  //   if (this.props.auth.isAuthenticated) {
  //     this.props.history.push('/dashboard');
  //   }
  // };

  componentWillReceiveProps = nextProps => {
    // if (nextProps.auth.isAuthenticated) {
    //   this.props.history.push('/dashboard');
    // }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors.error });
    }
  };
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    if (this.state.password !== this.state.password2) {
      return this.setState({ errors: 'Passwords do not match' });
    }
    const Password = {
      password: this.state.password
    };
    // console.log(this.props);
    // we can pass url parameters through history.location.pathname to axios to send it along formdata to backend.
    // at backend we will extract req.params and req.body to check the resetToken and then reset password.
    this.props.changePassword(Password, this.props.history);
  };

  render() {
    // const { errors } = this.state;
    return (
      <div>
        <div className="signin-form">
          <form onSubmit={this.onSubmit}>
            <h2>Reset Password</h2>

            <div className="form-group">
              <input
                type="password"
                className="form-control input-lg"
                name="password"
                value={this.state.password}
                onChange={this.onChange}
                placeholder="password"
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
                placeholder="confirm Password"
                required="required"
              />
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="btn btn-success btn-lg btn-block signup-btn"
              >
                Change Password
              </button>
            </div>
            {this.state.errors ? (
              <div className="text-center small red" style={{ color: 'red' }}>
                {this.state.errors}
              </div>
            ) : (
              ''
            )}
          </form>
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
  { changePassword }
)(withRouter(ChangePassword));
