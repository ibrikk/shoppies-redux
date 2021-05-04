import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Search from './components/Search';
import axios from 'axios';
import _ from 'lodash';
import { Grid, Container } from '@material-ui/core';

const App = () => {
  const MOVIE_API_URL = `http://www.omdbapi.com/?apikey=80e5588b`;
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [nominations, setNominations] = useState([]);

  const defaultImage =
    'https://image.shutterstock.com/image-vector/no-image-available-sign-internet-600w-261719003.jpg';

  // useEffect(() => {
  //   axios
  //     .get(MOVIE_API_URL)
  //     .then((response) => response.data)

  //     .then((response) => {
  //       setMovies(response.Search);
  //       setLoading(false);
  //     });
  // }, [MOVIE_API_URL]);

  const search = (searchValue) => {
    setLoading(true);
    setErrorMessage(null);

    axios
      //.get(`http://www.omdbapi.com/?s=${searchValue}&apikey=80e5588b`)
      .get(MOVIE_API_URL + `&s=` + searchValue)
      .then((response) => response.data)
      .then((response) => {
        console.log(response);
        if (response.Response === 'True') {
          setMovies(response.Search);
          setLoading(false);
        } else {
          setErrorMessage('Sorry, we have an issue in the backend!Error');
          setLoading(false);
        }
      });
  };

  const alreadyExists = (id) => {
    return nominations.findIndex((item) => item.imdbID === id);
  };

  const nominate = (id) => {
    if (alreadyExists(id) === -1) {
      for (const item of movies) {
        if (item.imdbID === id) {
          let a = _.cloneDeep(nominations);
          a.push(item)
          setNominations(a);
        }
      }
    }
  };

  const remove = id=> {
  

    
      let a = _.cloneDeep(nominations);
      a = a.filter(item => item.imdbID !== id);
      setNominations(a);
    
  }

  return (
    <div className='App'>
      <Header text='The Shoppies' />
      <Search search={search} />

      {/* Nominated Movies */}
      <p className='App-intro'>Sharing a few of our favourite movies</p>
      <Container>
        <Grid
          container
          direction='row'
          justify='space-evenly'
          alignItems='flex-start'
        >
          <Grid item>
            {loading && !errorMessage ? (
              <span>loading...</span>
            ) : errorMessage ? (
              <div className='errorMessage'>{errorMessage}</div>
            ) : (
              movies?.map((movie, id) => (
                <div>
                  <h2>{movie.Title}</h2>
                  <div>
                    <img
                      width='200'
                      alt={`The movie titled: ${movie.Title}`}
                      src={movie.Poster === 'N/A' ? defaultImage : movie.Poster}
                    />
                  </div>
                  <p>({movie.Year})</p>
                  <button className={alreadyExists(movie.imdbID) !== -1 ? 'isDisabled' : ''} disabled={alreadyExists(movie.imdbID) !== -1} onClick={() => nominate(movie.imdbID)}>NOMINATE</button>
                </div>
              ))
            )}
          </Grid>
          <Grid item>
          Your Nominated List 🍿
          {nominations?.map(nom => (
            <div>
                  <h2>{nom.Title}</h2>
                  <div>
                    <img
                      width='200'
                      alt={`The movie titled: ${nom.Title}`}
                      src={nom.Poster === 'N/A' ? defaultImage : nom.Poster}
                    />
                  </div>
                  <p>({nom.Year})</p>
                  <button onClick={() => remove(nom.imdbID)}>REMOVE</button>
                </div>
          ))}
          </Grid>
        </Grid>
        </Container>
    </div>
  );
};

export default App;
