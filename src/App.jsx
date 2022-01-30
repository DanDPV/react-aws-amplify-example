import { useEffect, useState } from 'react';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { IconButton, Paper } from '@material-ui/core';
import awsConfig from './aws-exports';
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';
import { listSongs } from './graphql/queries';
import { updateSong } from './graphql/mutations';
import '@aws-amplify/ui-react/styles.css';
import './App.css';
import { Favorite, PlayArrow } from '@material-ui/icons';

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

  const addLike = async idx => {
    try {
      const song = songs[idx];
      song.like = song.like + 1;
      delete song.createdAt;
      delete song.updatedAt;
      const songData = await API.graphql({
        query: updateSong,
        authMode: 'AMAZON_COGNITO_USER_POOLS',
        variables: {
          input: song,
        },
      });
      const songList = [...songs];
      songList[idx] = songData.data?.updateSong;
      setSongs(songList);
    } catch (error) {
      console.error('Error on adding like to song', error);
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
              <div className="song-list">
                {songs.map((song, idx) => (
                  <Paper variant="outlined" elevation={2} key={song.title}>
                    <div className="song-card">
                      <IconButton aria-label="play">
                        <PlayArrow />
                      </IconButton>
                      <div>
                        <div className="song-title">{song.title}</div>
                        <div className="song-owner">{song.owner}</div>
                      </div>
                      <div>
                        <IconButton
                          aria-label="like"
                          onClick={() => addLike(idx)}
                        >
                          <Favorite />
                        </IconButton>
                        {song.like}
                      </div>
                      <div className="song-description">{song.description}</div>
                    </div>
                  </Paper>
                ))}
              </div>
            </div>
          )}
        </Authenticator>
      </header>
    </div>
  );
}

export default withAuthenticator(App);
