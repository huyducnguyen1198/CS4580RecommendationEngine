/* eslint-disable react-hooks/rules-of-hooks */
import { Link, useNavigate } from 'react-router-dom';


export function sendData(data:string[]){

    const navigate = useNavigate();
    
    if(data.length === 0){
        return;
    }
    data = ["huy", "nguyen", "lord"]
    
    const sendData = () => {
        navigate("/movies", {state: {imdbList: data}});
    }
}