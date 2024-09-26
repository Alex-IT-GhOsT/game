import React, { useEffect } from "react";
import { Link, useMatch } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../config.js";
import './AboutCart.css'

const AboutCart = () => {
 
    const match = useMatch('/learn/:paramName');
    const blockName = match.params.paramName;
    const token = localStorage.getItem('token');
    const [timer, setTimer] = useState(null);
    const [quests, setQuests] = useState([]);
    const [currentQuest, setCurrentQuest] = useState(0);
    const [isAnswer, setIsAnswer] = useState(true);
    const [isFinisch, setIsFinisch] = useState(false);
    const [showBack, setShowBack] = useState(false);
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();
   
    const unsuccess = () => {
        setIsAnswer(false); 
        setShowBack(true);      
    }

    

    useEffect(() => {
        const getQuests = async () => {
            const response = await fetch(`${apiUrl}/api/date/${blockName}`,{
                method:'GET',
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Bearer ${token}`
                }, 
            })
            const data = await response.json();
            if (data.success) {
                if (data.data.length !== 0) {
                    setQuests(data.data);
                } else {
                    setIsFinisch(true);
                }
            }
        }
        getQuests();
    },[])

    const success = async (numberQuest, quest) => {
        const response = await fetch(`${apiUrl}/progress-user/`,{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                quest: quest,
                numberQuest: numberQuest,
                title: blockName,
            })
        })
        const data = await response.json()
        if (data.success) {
            clearTimeout(timer)
        }
    }

    const answeredQuest = () => {
        setIsAnswer(true);
        setCurrentQuest((prev => prev === quests.length ? 0 && setIsFinisch(true) : prev + 1)); 
        setShowBack(false)
    }

    const handleButtonClick = (numberQuest, quest) => {
        setCurrentQuest((prev => prev + 1));
        const time = setTimeout(() => {
            success(numberQuest, quest);
        }, 5000)
        setTimer(time);   
    }

    useEffect(() => {
        if (quests.length !== 0 && currentQuest === quests.length) {
            setIsFinisch(true);  
        } else {
            const proc =  Math.round((currentQuest / quests.length) * 100)
            setProgress(proc)
        }
    },[currentQuest])

    useEffect(() => {
        if (isFinisch) {
            navigate('/isRestartGame');
        }
    },[isFinisch, navigate])

    
    return <>
        <h1 className="mb-3">Начинаем изучение</h1>
            <div className="progressbar mb-3">
                <div className="progress-text">
                </div>
                <div className="progress bg-dark-subtle" role="progressbar" aria-label="Example with label" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
                    <div className="progress-bar progress-bar-striped progress-bar-animated" style={{width: `${progress}%`}}>{progress}%</div>
                </div>
            </div>
        <div className={`block ${isAnswer ? '' : 'flip'}`}>
            {quests.map((quest, ind) => {
                return <div key={quest._id} >
                    {ind === currentQuest && currentQuest < quests.length ?
                    <div className={`card text-center text-bg-dark mb-3 `} style={{width: 'auto'}}>
                        {isAnswer ? 
                        <div className={`card-body `}>
                            <h5 className="card-title">
                                {quest.eng}  
                            </h5>
                            <div className="blockButton">
                                <button className="btn btn-success" onClick={() => handleButtonClick(currentQuest, quest)}>Знаю</button>
                                <button className="btn btn-danger" onClick={unsuccess}>Не знаю</button>
                            </div>
                        </div>
                        :
                        <div className={`card-body ${showBack ? 'flipped' : ''}`}>
                            <h5 className="card-title">
                                <span> {quest.eng} - {quest.rus} </span>
                            </h5>
                                {quest.explanation_eng !== '' || quest.explanation_rus !== '' ? (
                                    <>
                                        {quest.explanation_eng && (
                                            <>
                                                <hr />
                                                <span>{quest.explanation_eng}</span>
                                            </>
                                        )}
                                        {quest.explanation_rus && (
                                            <>
                                                <hr />
                                                <span>{quest.explanation_rus}</span>
                                                <hr/>
                                            </>
                                        )}
                                    </>
                                ) : null}
                            <button className="btn btn-danger d-block mx-auto" onClick={answeredQuest}>Понял</button>
                        </div>
                        }
                    </div>
                    :
                    null  
                    }                  
                </div>
            })}
        </div>
    </>
}

export default AboutCart;