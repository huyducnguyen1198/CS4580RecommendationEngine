import { useLocation } from 'react-router-dom';


export function getMovieCluster(): string[] {
 // eslint-disable-next-line react-hooks/rules-of-hooks
    const location = useLocation();

    const imdbList = location.state?.imdbList;

    if(imdbList === undefined){
        return [];
    }
    return imdbList;
}