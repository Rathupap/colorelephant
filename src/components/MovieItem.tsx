import Image from "next/image";
import { Movie } from "types";
import { FaStar } from "react-icons/fa";

interface MovieItemProps {
    movie: Movie;
    onLikeMovie: (movieId: number) => void;
}

const MovieItem = ({ movie, onLikeMovie }: MovieItemProps) => {
    const { id, title, image, rating, year, liked } = movie;
    const handleLike = () => {
        onLikeMovie(id);
    }
    return (
        <div className={`movie-item ${liked && "liked"}`}>
            <a  href={`https://www.themoviedb.org/movie/${id}`} target="_blank" rel="noreferrer">
                <Image 
                    src={image} 
                    title={title} 
                    alt={`${title} cover`}
                    height={250}
                    width={200}
                />
            </a>
            <div className="content">
                <div>
                    <p>Title: {title}</p>
                    <p>Rating: {rating}</p>
                    <p>Year: {year}</p>
                </div>
                <div className="icon-container">
                    <FaStar onClick={handleLike} />
                </div>
            </div>
        </div>
    )
}

export default MovieItem;