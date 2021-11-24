import Image from "next/image";
import { Movie } from "types";

interface MovieItemProps {
    movie: Movie;
}

const MovieItem = ({ movie }: MovieItemProps) => {
    const { id, title, image, rating, year } = movie;
    return (
        <a className="movie-item" href={`https://www.themoviedb.org/movie/${id}`} target="_blank" rel="noreferrer">
            <Image 
                src={image} 
                title={title} 
                alt={`${title} cover`}
                height={250}
                width={200}
            />
            <div className="content">
                <p>Title: {title}</p>
                <p>Rating: {rating}</p>
                <p>Year: {year}</p>
            </div>
        </a>
    )
}

export default MovieItem;