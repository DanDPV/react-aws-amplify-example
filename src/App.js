import Amplify from 'aws-amplify';
import awsConfig from './aws-exports';
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

Amplify.configure(awsConfig);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Authenticator>
          {({ signOut, user }) => (
            <div className="App">
              <p>Hey {user.username}, welcome to my channel, with auth!</p>
              <button onClick={signOut}>Sign out</button>
            </div>
          )}
        </Authenticator>
      </header>
    </div>
  );
}

export default withAuthenticator(App);
