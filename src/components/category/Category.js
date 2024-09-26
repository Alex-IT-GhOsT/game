import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LearnedWords from "../learnWords/LearnedWords.js";
import ShowWords from "../showWords/ShowWords.js";
import { apiUrl } from "../../config.js";
import './Category.css'

const Category = ({name}) => {
    const token = localStorage.getItem('token');
    const [arrTitles, setArrTittlles] = useState([]);
    const [learndedWords, setLearndedWords] = useState(false);

    const handleClick = () => {
        setLearndedWords(!learndedWords);
    }
 
    useEffect(() =>  {
        const getTitle = async () => {
            const response = await fetch(`${apiUrl}/api/date`,{
                method:"GET",
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            })
            const data = await response.json();
            if (data.success) {
               setArrTittlles(data.arrTitles);
            }
        }
        getTitle();
    },[])

    return <>
        <div className="category-block">
            <header className="text-center">
                <h1>Выберите предлог для изучения</h1>
            </header>
            <div className="card-group justify-content-around">
                {arrTitles.map((item, ind) => {
                    return <div key={ind} className="main-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title text-center">{Object.keys(item)[0]}</h5>
                                        <Link to={`/learn/${Object.keys(item)[0]}`} className="btn btn-primary d-block mx-auto">Начать</Link>
                                    </div>
                                </div>
                            </div>
                })}
            </div>
            <LearnedWords
            handleClick={handleClick}
            />
            {learndedWords && (
                <ShowWords name={name} />
            )}
        </div>
    </>
}

export default Category;