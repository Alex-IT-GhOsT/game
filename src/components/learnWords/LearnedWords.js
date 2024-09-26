import React, { useState } from "react";
import './LearnedWords.css'

const LearnedWords = ({handleClick}) => {

    const [isOpenBlock, setIsOpenBlock] = useState(false)

    const changeColor = () => {
        handleClick();
        setIsOpenBlock(!isOpenBlock)
    }

    return (
        <div className="block-seeWords">
            <h4>Вы можете посмотреть выученные слова нажав на кнопку ниже</h4>
            <button className={isOpenBlock ? 'btn btn-danger' : 'btn btn-success' }
             onClick={changeColor}>
                {isOpenBlock ?  'Закрыть слова' :'Посмотреть слова' }
            </button>
        </div>
    )
}

export default LearnedWords;