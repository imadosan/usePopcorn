import { useState } from 'react';
import { Loader } from './components/util/Loader';
import { ErrorMessage } from './components/util/ErrorMessage';
import { Navbar } from './components/Navbar/Navbar';
import { Search } from './components/Navbar/Search';
import { NumResult } from './components/Navbar/NumResult';
import { Box } from './components/Box';
import { MovieList } from './components/movie/MovieList';
import { MovieDetails } from './components/movie/MovieDetails';
import { WatchedSummary } from './components/watched/WatchedSummary';
import { WatchedMovieList } from './components/watched/WatchedMovieList';
import { Main } from './components/Main';
import { useMovie } from './components/hooks/useMovie';
import { useLocalStorageState } from './components/hooks/useLocalStorageState';

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const { movies, isLoading, error } = useMovie(query);
  const [watched, setWatched] = useLocalStorageState([], 'watched');

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {/*{isLoading ? <Loader /> : <MovieList movies={movies} />}*/}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
