import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import './bootStrapLogin2.css';
import { verificationEmail } from '../actions/authAction';

class VerificationToken extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      success: '',
      errors: ''
    };
  }

  componentDidMount = () => {
    this.props.verificationEmail(this.props.history);
    // axios
    //   .post(`/api/users/${history.location.pathname}`)
    //   .then(res => this.setState({ success: res.data }))
    //   .catch(err =>
    //     dispatch({
    //       type: GET_ERRORS,
    //       payload: err.response.data
    //     })
    //   );
  };
  componentWillReceiveProps = nextProps => {
    if (nextProps.success) {
      this.setState({ success: nextProps.success.success });
    }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors.error });
    }
  };

  render() {
    return (
      <div>
        {this.state.success && (
          <div class="alert alert-success" role="alert">
            {this.state.success}
            {''}
            <Link to="/" class="alert-link">
              click here to login
            </Link>
            . to access your account.
          </div>
        )}
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
            <div className="text-center small">
              <Link to="/resendemail">resend verification code</Link>
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

const mapStateToProps = (state, ownProps) => {
  return {
    auth: state.auth,
    errors: state.errors,
    success: state.success.success
  };
};

export default connect(
  mapStateToProps,
  { verificationEmail }
)(withRouter(VerificationToken));
