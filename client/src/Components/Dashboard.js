import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Alert } from 'reactstrap';

class DashBoard extends Component {
  constructor() {
    super();
    this.state = {
      auth: '',
      success: '',
      errors: ''
    };
  }

  componentDidMount = () => {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push('/');
    }
  };

  componentWillReceiveProps = nextProps => {
    if (!nextProps.auth.isAuthenticated) {
      this.props.history.push('/');
    }
  };

  render() {
    return (
      <div>
        <Alert color="light" style={{ marginTop: '3%' }}>
          Dashboard Page{' '}
        </Alert>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(withRouter(DashBoard));
