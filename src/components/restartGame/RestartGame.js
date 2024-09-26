import React from "react";
import { Link } from "react-router-dom";
import './RestartGame.css'

const RestartGame = ({title}) => {

    return (
        <>
            <div className="alert alert-success text-center">
                <h4>Поздравляю! Вы ответили на все вопросы</h4>
                <div className="againGame">
                    <Link className="btn btn-primary" to="/learn">Вернуться к выбору вопросов</Link>
                </div>
            </div>
        </>
        
    )
}

export default RestartGame;