import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authAction';

class Header extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  // componentDidMount = () => {
  //   if (!this.props.auth.isAuthenticated) {
  //     this.props.history.push('/');
  //   }
  // };
  // below will check if props changes, when logged out it will trigger and redirect
  // componentWillReceiveProps = nextProps => {
  //   if (!nextProps.auth.isAuthenticated) {
  //     this.props.history.push('/');
  //   }
  // };

  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser(this.props.history);
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav>
          {user.photo ? (
            <a>
              <img
                className="rounded-circle"
                src={user.photo}
                alt={user.name}
                style={{ width: '25px', marginRight: '5px' }}
                title={user.name}
              />{' '}
              {user.name}
            </a>
          ) : (
            <a>
              <img
                className="rounded-circle"
                src="/placeholder.jpg"
                alt={user.name}
                style={{ width: '25px', marginRight: '5px' }}
                title="You must have a Gravatar connected to your email to display an image"
              />{' '}
              {user.name}
            </a>
          )}
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem>
            {user.method === 'local' ? (
              <Link
                style={{
                  textDecoration: 'none',
                  fontWeight: '600',
                  color: 'gray'
                }}
                to="/forgot"
              >
                Change Password{' '}
              </Link>
            ) : (
              ''
            )}
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem>
            {user.photo ? (
              <a
                href=""
                onClick={this.onLogoutClick.bind(this)}
                className="Link"
                style={{
                  textDecoration: 'none',
                  fontWeight: '600',
                  color: 'gray'
                }}
              >
                <img
                  className="rounded-circle img-fluid"
                  src={user.photo}
                  alt={user.name}
                  style={{ width: '25px', marginRight: '5px' }}
                  title="You must have a Gravatar connected to your email to display an image"
                />
                Sign Out
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
                Sign Out
              </a>
            )}{' '}
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    );

    const guestLinks = (
      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav caret>
          Sign In
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem>
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                fontWeight: '600',
                color: 'gray'
              }}
            >
              Sign In
            </Link>
          </DropdownItem>
          <DropdownItem>
            <Link
              to="/signup"
              style={{
                textDecoration: 'none',
                fontWeight: '600',
                color: 'gray'
              }}
            >
              Sign Up
            </Link>
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem>
            <Link
              to="/forgot"
              style={{
                textDecoration: 'none',
                fontWeight: '600',
                color: 'gray'
              }}
            >
              forgot password
            </Link>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    );

    return (
      <div>
        <Navbar color="faded" light expand="md">
          <NavbarBrand href="/">FullStack Oauth</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {isAuthenticated ? authLinks : guestLinks}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
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
)(withRouter(Header));
