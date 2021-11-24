import { ChangeEvent, EventHandler, useState } from "react";
import { InferGetServerSidePropsType } from "next";
import { Movie } from "types";
import MovieItem from "components/MovieItem";
import { orderBy } from "lodash";

const sortBy = ["Year Desc", "Year Asc", "Title Asc", "Title Desc", "Rating Desc", "Rating Asc"];

const Home = ({ movies }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [sortedMovies, setSortedMovies] = useState<Movie[]>(movies);

  const handleSortBy = (sortValue: string) => {
    
    switch(sortValue) {
      case "Year Desc":
        setSortedMovies(orderBy(sortedMovies, "year", "desc"))
        break;
      case "Year Asc":
        setSortedMovies(orderBy(sortedMovies, "year", "asc"))
        break;
      case "Title Desc":
        setSortedMovies(orderBy(sortedMovies, "title", "desc"))
        break;
      case "Title Asc":
        setSortedMovies(orderBy(sortedMovies, "title", "asc"))
        break;
      case "Rating Desc":
        setSortedMovies(orderBy(sortedMovies, "rating", "desc"))
        break;
      case "Rating Asc":
        setSortedMovies(orderBy(sortedMovies, "rating", "asc"))
        break;
      default:
        setSortedMovies(movies);
    }

  }

  const handleOnFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    handleSortBy(e.target.value);
  }
  return (
    <div className="container">
      <div className="select-wrapper">
        <p>Sort By: </p>
        <select onChange={handleOnFilterChange}>
            <option>Default</option>
            {
              sortBy.map((sortByItem) => (
                <option key={sortByItem} value={sortByItem}>{sortByItem}</option>
              ))
            }
        </select>
      </div>
      {
        movies.length > 0 ? 
        <div className="movies">
          {
            sortedMovies.map((movie) => (
              <MovieItem movie={movie} key={movie.id} />
            ))
          }
        </div>
        :
        <p className="no-results">No results found.</p>
      }
    </div>
  );
}

export const getServerSideProps = async () => {

  try {
    const data = await (await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_API_KEY}`)).json();
    const movies: Movie[] = data.results.map((result: any) => ({
      id: result.id,
      title: result.title,
      image: `https://image.tmdb.org/t/p/w200${result.poster_path}`,
      rating: result.vote_average,
      year: new Date(result.release_date).getFullYear()
    }));
    return {
      props: {
        movies
      }
    }
  }

  catch(err) {
    return {
      props: {
        movies: []
      }
    }
  }

}

export default Home;
