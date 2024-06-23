// src/App.js
import React from 'react';
import Nav from './Nav';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const App = () => {

  return (
    <div>     
       <Nav />
    </div>
  );
};

const customAuthenticator = withAuthenticator(App, {
  hideSignUp: true
});

export default customAuthenticator;
