import React, { useEffect, useState } from "react";
import { apiUrl } from "../../config.js";
import './ShowWords.css'

const ShowWords = ({name}) => {
    const [words, setWords] = useState([]);
    const [needToLearnWords, setNeedToLearnWords] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allUserQuestions, setAllUserQuestions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [openBlockIndex, setOpenBlockIndex] = useState(-1);

    const getWordsForCategory = (categoryName) => {
        const answeredWords = allUserQuestions
            .filter((quest) => quest.nameBlock === categoryName && quest.userName === name)
            .flatMap((quest) => quest.numberQuests.quests.map((item) => item.idQuest));
        const wordsForCategory = words.filter((word) =>
            answeredWords.includes(word._id)
        );
        const uniqueIds = new Set();
        const uniqueQuestions = wordsForCategory.filter(question => {
        if (!uniqueIds.has(question._id)) {
            uniqueIds.add(question._id);
            return true;
        }
        return false;
        });
        return uniqueQuestions;
    };

    const getUnansweredWordsForCategory = (categoryName) => {
        const answeredQuestionsForCategory = allUserQuestions
            .filter((quest) => quest.nameBlock === categoryName)
            .flatMap((quest) => quest.numberQuests.quests.map((item) => item.idQuest));
       
        const hasSelectedCategory = needToLearnWords.some((title) => title.title === categoryName)
        const myTitles = hasSelectedCategory ? 
        needToLearnWords.filter((title) => title.title === categoryName)
        : 
        needToLearnWords;
        const unansweredWordsForCategory = myTitles.filter((word) => !answeredQuestionsForCategory.includes(word.title))
        return unansweredWordsForCategory;
    };

   
    const handleClick = (ind) => {
        setOpenBlockIndex((prevIndex) => (prevIndex === ind ? -1 : ind));
        setSelectedCategory(Object.keys(categories[ind])[0]);
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        const getWords = async () => {
            const response = await fetch(`${apiUrl}/api/date`,{
                method: "GET",
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            })
            const data = await response.json();
            if (data.success) {
                setWords(data.words);
                setNeedToLearnWords(data.allWords);
                setCategories(data.arrTitles);
                setAllUserQuestions(data.allUserQuestions)
            }
        } 
        getWords();
    },[])

    const printText = (e) => {
        e.stopPropagation();
        const printWindow = window.open('', '_blank');
        const content = document.querySelector('.category_block.open');

        if (content) {
            printWindow.document.write(content.innerHTML);
            printWindow.print();
        }  
        
    }

    return (
        <div>
            <div className="category">
                {categories.map((category,ind) => {
                    const isOpen = openBlockIndex === ind;
                    return <div key={ind}
                    className={`category_block ${isOpen ? 'open' : ''}`}
                    onClick={() => handleClick(ind)}
                    >
                        <strong>{Object.keys(category)[0]}</strong>
                        {isOpen && <div>
                                <button onClick={(e) => printText(e)} id="btnPrint" className="btn btn-primary">Распечатать слова</button>
                                <ul>
                                {getWordsForCategory(selectedCategory).map((word, ind) => (
                                            <li className="text-success" key={ind}>
                                                <span>{word.eng} - {word.rus}</span>
                                            </li>
                                        ))}
                                    {getUnansweredWordsForCategory(selectedCategory).map((unansweredWord, ind) => (
                                        <li key={ind} className="text-danger">
                                            <span>
                                                {unansweredWord.eng} - {unansweredWord.rus}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>}
                    </div>
                })}
            </div>
        </div>
    )
}

export default ShowWords;