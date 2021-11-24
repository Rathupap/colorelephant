import { ChangeEvent, useState } from "react";
import cookies from "next-cookies";
import JSCookies from "js-cookie";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { Movie } from "types";
import MovieItem from "components/MovieItem";
import { orderBy } from "lodash";

interface Result {
  adult?: boolean,
  backdrop_path?: string | null,
  genre_ids?: number[],
  id?: number,
  original_language?: string,
  original_title?: string,
  overview?: string,
  popularity?: number,
  poster_path?: string | null,
  release_date?: string,
  title?: string,
  video?: boolean,
  vote_average?: number,
  vote_count?: number
}

const sortBy = ["Year Desc", "Year Asc", "Title Asc", "Title Desc", "Rating Desc", "Rating Asc"];

const Home = ({ movies }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [sortedMovies, setSortedMovies] = useState<Movie[]>(movies as Movie[]);

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
        setSortedMovies(movies as Movie[]);
    }

  }

  const handleOnFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    handleSortBy(e.target.value);
  }

  const handleLikeMovie = (movieId: number) => {
    const updatedMovies = sortedMovies.map((movie) => {
      if(movieId === movie.id) {
        return {
          ...movie,
          liked: !movie.liked
        }
      }
      return movie
    });
    setSortedMovies(updatedMovies);
    JSCookies.set("movies", JSON.stringify(updatedMovies), {
      expires: new Date("2040-10-03").getTime()
    });
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
              <MovieItem movie={movie} key={movie.id} onLikeMovie={handleLikeMovie} />
            ))
          }
        </div>
        :
        <p className="no-results">No results found.</p>
      }
    </div>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  
  const { movies } = cookies(ctx);

  if(movies) {
    return {
      props: {
        movies
      }
    }
  }

  try {
    const data = await (await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_API_KEY}`)).json();
    console.log(data.results[0].genre_ids)
    const moviesData: Movie[] = data.results.map((result: Result) => ({
      id: result.id,
      title: result.title,
      image: `https://image.tmdb.org/t/p/w200${result.poster_path}`,
      rating: result.vote_average,
      year: new Date(result.release_date as string).getFullYear(),
      liked: false
    }));
    return {
      props: {
        movies: moviesData
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
