import React,{ Component } from 'react';

import FacebookProvider, { LoginButton } from 'react-facebook';

class LoginComponent extends Component {

  allowViewing = () => {
    this.props.fixLoginState();
  };

  handleLoginResponse = (data) => {
    if(data.hasOwnProperty('profile') && 
      data.profile.hasOwnProperty('verified') && 
      data.profile.verified) {
      this.allowViewing();
    }
  }
 
  handleLoginError = (error) => {
    this.setState({ error });
  }
 
  render() {
    return (
      <FacebookProvider appId="317933722057064">
        <LoginButton
          scope="email"
          onResponse={this.handleLoginResponse}
          onError={this.handleLoginError}
        >
          <span>Login via Facebook</span>
        </LoginButton>
      </FacebookProvider>
    );
  }
}

export default LoginComponent;