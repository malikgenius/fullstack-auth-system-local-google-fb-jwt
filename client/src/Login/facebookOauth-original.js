import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clientId from '../config/Keys';
import axios from 'axios';

class FacebookOauth extends Component {
  constructor() {
    super();
    this.state = {
      showButton: false
    };
  }

  render() {
    const responseFacebook = response => {
      const access_token = response.accessToken;
      // console.log(JSON.stringify({ access_token: responseFacebook }));
      if (access_token) {
        axios.post('/api/users/facebook', { access_token }).then(res => {
          console.log(res.data);
        });
      } else {
        console.log('Error: Axios couldnt get anything from Facebook');
      }
    };

    return (
      <div className="container">
        <div className="alert alert-light" role="alert" size="large">
          <h4>
            Popup will take you to Facebook Login page, if you dont see any
            popup please Click on link below.
          </h4>
        </div>

        <FacebookLogin
          appId={clientId.facebookClientID}
          autoLoad={true}
          fields="name,email,picture"
          callback={responseFacebook}
          // cssClass="btnFacebook"
          // icon={<i className="fa fa-facebook" />}
          // textButton="&nbsp;&nbsp;Sign In with Facebook"
        >
          <i
            className="fa fa-facebook"
            style={{
              marginLeft: '5px'
            }}
          />
          <span>&nbsp;&nbsp;Sign In with Facebook</span>
        </FacebookLogin>
      </div>
    );
  }
}

export default FacebookOauth;
