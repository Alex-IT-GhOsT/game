import React, { useState, useEffect } from "react";
import { apiUrl } from "../../config.js";
import DeleteProgress from "../deleteProgress/DeleteProgress.js";

import './Progress.css';


const Progress = ({name}) => {

    const [totalWords, setTotalWords] = useState([]);
    const [progress, setPtogress] = useState({})
    
    useEffect(() => {
        const token = localStorage.getItem('token')
        const getProgressFromServer = async () => {
            const response = await fetch(`${apiUrl}/api/date`,{
                method:"GET",
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json();

            if (data.success) {
                setTotalWords(data.totalWords);
                const updateProgress = getProcent( data.totalWords, data.allUserQuestions );
                setPtogress(updateProgress);
            }
        }
        getProgressFromServer();
    },[])

      const getProcent = (allWords, allQuest) => {
        let obj = {};
      
        allQuest.forEach(element => {
          const { nameBlock, numberQuests, userName } = element;
          const questsCount = numberQuests.quests.length;
          if (userName === name) {
            obj[nameBlock] = (obj[nameBlock] || 0) + questsCount;
          }
          
        });
      
        allWords.forEach(element => {
          const title = Object.keys(element)[0];
          const numWords = Object.values(element)[0];
          
          if (obj.hasOwnProperty(title)) {
            const numQuestions = obj[title];
            const percentage = numQuestions / numWords * 100 || 0;
            obj[title] = Math.round(percentage);
          }
        });
        setPtogress(obj)  
        return obj;
      };

      return (
        <>
        <div className="progress-block">
          <h1 className="text-center pt-2">Ваш прогресс</h1>
          {totalWords.map((total, index) => {
            const category = Object.keys(total)[0];
            const categoryProgress = progress[category] || 0
            return (
              <div className="progressbar" key={index}>
                <div className="progress-text">
                  <span><strong>{category}</strong></span>
                </div>
                <div className="progress bg-dark-subtle" role="progressbar" aria-label="Example with label" aria-valuenow={categoryProgress} aria-valuemin="0" aria-valuemax="100">
                    <div className="progress-bar" style={{width: `${categoryProgress}%`}}>{categoryProgress}%</div>
                </div>
              </div>
            );
          })}
        </div>
        <DeleteProgress setPtogress={setPtogress}/>
        </>
      );
}

export default Progress;