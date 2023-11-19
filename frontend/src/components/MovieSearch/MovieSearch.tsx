import React from 'react';
import { useEffect, useState } from 'react';
import PageContainer from './PageContainer';
import SortOption, { WeightsType} from './SortOption/SortOption';
import axios from 'axios';
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./MovieCardContainer.module.css";
import { useLocation } from 'react-router-dom';

import {getMovieCluster} from './getMovieCluster';

/************************/
/* just some css styling */
/************************/
const movieDetailsStyle = {
  backgroundColor: '#f8f9fa', // Light gray background
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Box shadow for a subtle effect
};

/*******************************/
/*    Movie interface           */
/*******************************/
interface Movie {
    //backend data
    title: string;
    genres: string;
    imdbId: string;
    year: string;
    jaccard : number;
    cosine : number;
    JacCosScore : number;
    yearSim : number;
    lavenshtein : number;
    sortScore : number|0;
    //api data
    poster: string;
    rated: string|null;
}

/*******************************/
/*    sort fucntion            */
/*******************************/
function sortMovieList(movList: Movie[], sortOption: (keyof Movie)[], reverse: boolean = true) {
    const compare = (a:Movie, b:Movie) =>{
        let comparison = 0;
        sortOption.forEach((opt) => {
            const valueA = a[opt];
            const valueB = b[opt];
            if(valueA === null || valueB === null){
                return 0 ;
            }

            if (valueA > valueB) {
                comparison = 1;
            } else if (valueA < valueB) {
                comparison = -1;
            }
        });

        return reverse ? comparison * -1 : comparison;
    
    }
    return movList.sort(compare);
}


/*******************************/
/*    MoviePage component       */
/*******************************/

const MoviePage: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(true);



    /************************************/
    /*   Fetch movie list by imdbIDList */
    /************************************/
    const [imdbList, setImdbList] = React.useState<string[]>([]);
    const [kValue, setKValue] = React.useState<number>(10);
    const [options, setOptions] = React.useState<string[]>([]);
    //const imdbList = getMovieCluster();
    
    const location = useLocation();

    useEffect(() => {

        const queryParams = new URLSearchParams(location.search);
        //const imdbs = queryParams.get('imdbList');
    
        const imdbs = queryParams.get('imdbList')?.split(',');
        const k = queryParams.get('k');
        const options = queryParams.get('options')?.split(',');
        console.log(queryParams);
        console.log(imdbs);
        console.log(k);
        console.log(options);

        
        if(imdbs === undefined || imdbs === null ){
            return;
        }
        if(k === undefined || k === null ){
            setKValue(10);
            return;
        }
        if(options === undefined || options === null ){
            setOptions(['title', 'genres']);
            return;
        }

        setImdbList(imdbs);
        setKValue(Number(k));
        setOptions(options);
    
        //setImdbList(imdbs.split(','));
    }, [location]);
    

    /************************************/
    /*   Sort option                    */
    /************************************/

    const [sortOption, setSortOption] = React.useState<string[]>([]);
    /*const handleSortChange = (opt: string, isChecked: boolean) => {
        if (isChecked) {
            setSortOption([...sortOption, opt]);
        } else {
            setSortOption(sortOption.filter((o) => o !== opt));
        }
    }
    useEffect (() => {
        const options:(keyof Movie)[] = []
        if(sortOption.includes("Plot")){
            options.push("cosine");
        }

        if(sortOption.includes("title") && sortOption.includes("genres")){
            options.push("JacCosScore");
        }else{
            if(sortOption.includes("Title")){
                options.push("lavenshtein");
            }
            if(sortOption.includes("Genres")){
                options.push("jaccard");
            }
        }
    
        if (options.length === 0) {
            
            setCompl([...complOrg]);
            console.log("no sort option");
            console.log(complOrg);
            return;
        }
        const sorted = sortMovieList([...compl], options)
        setCompl(sorted);

    }, [sortOption]);*/
    const [compl, setCompl] = React.useState<Movie[]>([]);

    const handleSortChange1 = ( weights: WeightsType) => {
        console.log(weights);
        const updatedMovies = compl.map(movie => ({
            ...movie,
            sortScore: movie.cosine * weights.Plot + movie.lavenshtein * weights.Title + movie.JacCosScore * weights.Genres
        }));
        const sorted = sortMovieList(updatedMovies, ["sortScore"], true);

        setCompl(sorted);
    }

    


    /************************************/
    /*   Fetch movie list by imdbIDList */
    /************************************/
    const [movieList, setMovieList] = React.useState<Movie[]>([]);
    const [complOrg, setComplOrg] = React.useState<Movie[]>([]);

    useEffect(() => {
        const fetchMovieList = async () => {
            try {
                const res = await axios({
                    method: "POST",
                    url: "http://localhost:8000/api/movies/listbyimdbs/",
                    data: { 
                        imdbList: imdbList,
                        options: options,
                        k: kValue,
                     },
                });
                const json = await res.data;
                setMovieList(json);
            } catch (error) {
                console.log(error);
                throw error;
            }
        };

        fetchMovieList();
    }, [imdbList]);

    useEffect(() => {
        const completeMovieList = async (mov: Movie) => {
            const padWithLeadingZeros = (s: string, targetLength: number): string => {
                s = String(s)
                while (s.length < targetLength) {
                    s = '0' + s;
                }
                return s;
            };
    
            const imdb = "tt" + padWithLeadingZeros(mov.imdbId, 7);
            //console.log(imdb);
            /*list of key
                f451c5dd
                4daa1e35
                7cb0f304
            */
            const response = await fetch(`https://www.omdbapi.com/?i=${imdb}&apikey=f451c5dd`);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
    
            const movieData: any = await response.json();  

            mov.poster = movieData.Poster;
            mov.rated = movieData.Rated;
        };

        const completeList = movieList.map(async (mov) => {
            await completeMovieList(mov);
            return mov;
        });
        Promise.all(completeList).then((res) => {
            setCompl(res);
            setComplOrg(res);

        });

    }, [movieList]);

    useEffect(() => {
        //console.log(compl);
        setLoading(false);
    }, [compl]);


    // Fetch and display movie details using imdbID
    return (
        <PageContainer>
            <div style={movieDetailsStyle}>
                    <h1>Movie Recommendation based selected Movies</h1>
            
                <SortOption onSortChange={handleSortChange1} />
            </div>
            <Col md={10}>
                <Container>
                    <Row>
                    {compl.map((movie, index) => (
                        <Col md={3} key={movie.imdbId}>
                        <Card
                            style={{ width: "15rem", margin: "2px", cursor: "pointer" }}
                        >
                            <Card.Img variant="top" src={movie.poster} />
                            <Card.Body>
                            <Card.Title>{movie.title}</Card.Title>
                            <Card.Text>
                                <div>Genre: {movie.genres}</div>
                                <div>IMDB ID: {movie.imdbId}</div>
                                <div>Year: {movie.year}</div>
                            </Card.Text>
                            </Card.Body>
                        </Card>
                        </Col>
                    ))}
                    </Row>
                </Container>
                </Col>

        </PageContainer>
    );
};

export default MoviePage;
