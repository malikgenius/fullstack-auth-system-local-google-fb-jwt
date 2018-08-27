import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';
import axios from 'axios';
// import './bootStrapLogin2.css';
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
        <div className="container" style={{ marginTop: '5%' }}>
          <Alert color="light">
            Thanks for registering, please check your email for verification
            link{' '}
          </Alert>
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
