import { useLocation } from 'react-router-dom';


export function getMovieCluster(): string[] {
 // eslint-disable-next-line react-hooks/rules-of-hooks
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const imdbList = queryParams.get('imdbList');

    if(imdbList === undefined || imdbList === null ){
        return [];
    }

    return imdbList.split(',');
}