import React from 'react';
import GoogleLogin from 'react-google-login';
// import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faStroopwafel } from '@fortawesome/free-solid-svg-icon s';
import clientId from '../config/Keys';
import axios from 'axios';
// or
// import { GoogleLogin } from 'react-google-login';
const GoogleOauth = () => {
  const responseGoogle = response => {
    console.log(response);
    const access_token = response.Zi.access_token;
    // console.log(JSON.stringify({ access_token: access_token }));
    // console.log(access_token);
    if (access_token) {
      axios.post('/api/users/google', { access_token }).then(res => {
        console.log(res.data);
      });
    } else {
      console.log('Error: Axios couldnt get anything from Google');
    }
  };

  return (
    <div className="container">
      <div class="alert alert-light" role="alert">
        Popup will take you to Google Login page, if you dont see any popup
        please Click on link below.
      </div>
      <GoogleLogin
        clientId={clientId.googleClientID2}
        // buttonText="Login with Google"
        // name="google"
        autoLoad={true}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
      >
        {/* <FontAwesome name="google" />
        <span> Login with Google</span> */}
      </GoogleLogin>
    </div>
  );
};

export default GoogleOauth;
