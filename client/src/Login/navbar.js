import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authAction';

class Dashboard extends Component {
  componentDidMount = () => {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push('/');
    }
  };
  // below will check if props changes, when logged out it will trigger and redirect
  componentWillReceiveProps = nextProps => {
    if (!nextProps.auth.isAuthenticated) {
      this.props.history.push('/');
    }
  };

  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser(this.props.history);
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <NavItem>
        <ul className="navbar-nav ml-auto">
          <li className="NavItem">
            {user.photo ? (
              <a
                href=""
                onClick={this.onLogoutClick.bind(this)}
                className="Link"
              >
                <img
                  className="nav-rounded-circle"
                  src={user.photo}
                  alt={user.name}
                  style={{ width: '25px', marginRight: '5px' }}
                  title="You must have a Gravatar connected to your email to display an image"
                />
                Logout
              </a>
            ) : (
              <a
                href=""
                onClick={this.onLogoutClick.bind(this)}
                className="nav-link"
              >
                <img
                  className="rounded-circle"
                  src="/placeholder.jpg"
                  alt={user.name}
                  style={{ width: '25px', marginRight: '5px' }}
                  title="You must have a Gravatar connected to your email to display an image"
                />
                Log Out
              </a>
            )}{' '}
          </li>
        </ul>
      </NavItem>
    );

    const guestLinks = (
      <ul className="Nav mlAuto">
        <li className="nav-item">
          <Link className="nav-link" to="/signup">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/">
            Login
          </Link>
        </li>
      </ul>
    );

    return (
      <Navbar inverse>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#brand">React-Bootstrap</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="#">
              Link
            </NavItem>
          </Nav>
          <Nav pullRight>{isAuthenticated ? authLinks : guestLinks}</Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(withRouter(Dashboard));
