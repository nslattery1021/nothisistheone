// src/App.js
import React from 'react';
import Nav from './Nav';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const App = ({ signOut, user }) => {

  return (
    <div>     
       <Nav />
       <button onClick={signOut}>Sign out</button>
    </div>
  );
};

export default withAuthenticator(App);
