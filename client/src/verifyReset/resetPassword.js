import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import './bootStrapLogin2.css';
import { resetPassword } from '../actions/authAction';

class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      success: '',
      errors: ''
    };
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.success) {
      this.setState({ success: nextProps.success.success });
    }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors.error });
    }
  };

  onChange = e => {
    // const value = e.target.value;
    console.log(e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const Email = {
      email: this.state.email
    };
    // sending to authaction with router history so history.push() will work. Andrew Mead showed different way.
    // which is to create another component for example tokenpage and this should be tokenform etc ..
    this.props.resetPassword(Email, this.props.history);
    // return console.log(Token);
    // axios
    //   .post('/api/users/verifytoken', { token: Token.token })
    //   .then(res => this.setState({ success: res.data }))

    //   .catch(err => this.setState({ errors: err.response.data }));
  };

  render() {
    return (
      <div>
        {this.state.success && (
          <div className="alert alert-success" role="alert">
            {this.state.success}
            {''}
            <Link to="/" className="alert-link">
              click here
            </Link>
          </div>
        )}
        <div className="signin-form">
          <form onSubmit={this.onSubmit}>
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
              <button
                type="submit"
                className="btn btn-success btn-lg btn-block signup-btn"
              >
                Password Reset
              </button>
            </div>

            {this.state.errors ? (
              <div className="text-center small red" style={{ color: 'red' }}>
                {this.state.errors}
              </div>
            ) : (
              ''
            )}

            {this.state.success && (
              <div className="text-center small red">{this.state.success}</div>
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
    errors: state.errors,
    success: state.success
  };
};

export default connect(
  mapStateToProps,
  { resetPassword }
)(withRouter(ResetPassword));
