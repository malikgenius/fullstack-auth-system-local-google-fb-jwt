import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginUser } from '../actions/authAction';
import './bootStrapLogin2.css';

class BootStrapLogin2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      errors: ''
    };
  }

  componentDidMount = () => {
    axios
      .get('/api/users/dashboard')
      .then(res => {
        this.setState({ name: res.data });
      })
      .catch(err => this.setState({ errors: err.response.data }));
  };

  onSubmit = e => {
    e.preventDefault();
    const User = {
      email: this.state.email,
      password: this.state.password
    };

    axios
      .get('/api/users/dashboard')
      .then(res => {
        console.log(res.data);
      })
      .catch(err => this.setState({ errors: err.response.data }));
  };

  render() {
    const { errors } = this.state;
    return (
      <div>
        <div className="signin-form">
          <form onSubmit={this.onSubmit}>
            <div className="form-group" />
            {this.state.errors ? (
              <div className="text-center small red" style={{ color: 'red' }}>
                {this.state.errors}
              </div>
            ) : (
              <div className="text-center small red" style={{ color: 'blue' }}>
                {this.state.name}
              </div>
            )}
            <div className="text-center small">
              <a href="#">Forgot Your password?</a>
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
