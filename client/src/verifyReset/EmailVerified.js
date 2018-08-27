import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Alert } from 'reactstrap';
// import './bootStrapLogin2.css';

class EmailVerified extends Component {
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

  render() {
    return (
      <div>
        <Alert color="light" style={{ marginTop: '3%' }}>
          Your account is verified successfuly, Please click on the link{' '}
          <Link to="/">Log in</Link> to get to your account.
        </Alert>
      </div>
    );
  }
}

export default EmailVerified;
