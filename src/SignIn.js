import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';

function SignIn() {
  return (
    <div>
      <h1>Welcome to My App</h1>
      <p>Please sign in to continue.</p>
    </div>
  );
}

export default withAuthenticator(SignIn);
