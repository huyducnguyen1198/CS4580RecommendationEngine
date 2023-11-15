/* eslint-disable react-hooks/rules-of-hooks */
import { Link, useNavigate } from 'react-router-dom';

interface Movie {
    title: string;
    genres: string[];
    posterUrl: string;
    imdbId: string;
    year: string;
    rated: string;
    plot: string;
  }

export function extractImdb(movieList: Movie[]){
    const imdbList = movieList.map((movie) => movie.imdbId);
    return imdbList;
}
export default function sendData(data:string[]){

    const navigate = useNavigate();
    
    if(data.length === 0){
        return;
    }
    data = ["huy", "nguyen", "lord"]
    
    const sendData = () => {
        navigate("/movies", {state: {imdbList: data}});
    }
}