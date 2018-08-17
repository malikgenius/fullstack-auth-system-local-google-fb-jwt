import React from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import googleClientId from '../config/Keys';
import axios from 'axios';
import fbClientId from '../config/Keys';

const SocialLogins = () => {
  const responseGoogle = response => {
    console.log(response);
    const access_token = response.Zi.access_token;
    console.log(JSON.stringify({ access_token: access_token }));
    console.log(access_token);
    axios.post('/api/users/google', { access_token }).then(res => {
      console.log(res);
    });
  };

  const responseFacebook = response => {
    const access_token = response.accessToken;
    // console.log(JSON.stringify({ access_token: responseFacebook }));
    axios.post('/api/users/facebook', { access_token }).then(res => {
      console.log('AXIOS RES', res);
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <FacebookLogin
          appId={fbClientId.facebookClientID}
          autoLoad={false}
          fields="name,email,picture"
          callback={responseFacebook}
          cssClass="btnFacebook"
          icon={<i className="fa fa-facebook" style={{ marginLeft: '5px' }} />}
          textButton="&nbsp;&nbsp;Sign In with Facebook"
        />
        <GoogleLogin
          clientId={googleClientId.googleClientID2}
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          className="btnGoogle"
        >
          <i className="fa fa-google-plus" style={{ marginLeft: '5px' }} />
          <span>&nbsp;&nbsp;Sign In with Google</span>
        </GoogleLogin>
      </div>
    </div>
  );
};

export default SocialLogins;
