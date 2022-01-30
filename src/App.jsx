import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsConfig from './aws-exports';
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';
import { listSongs } from './graphql/queries';
import '@aws-amplify/ui-react/styles.css';
import './App.css';
import { useEffect, useState } from 'react';

Amplify.configure(awsConfig);

function App() {
  const [songs, setSongs] = useState([]);
  const fetchSongs = async () => {
    try {
      const songData = await API.graphql({
        query: listSongs,
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      });
      const songList = songData.data?.listSongs.items;
      console.log(songList);
      setSongs(songList);
    } catch (error) {
      console.error('Error on fetching songs', error);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

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
