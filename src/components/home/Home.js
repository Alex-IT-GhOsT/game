import React, { useEffect } from "react";
import './Home.css'
import { FaCheckCircle } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Home = ({isAuthorizationUser}) => {

    return (
    <div className="home-block">
        <h1 className="text-center mb-4 text-primary">Тренажер</h1>
        <h2 className="text-center mb-4 text-primary">Изучение английских слов с предлогами</h2>
        <p>
            Наше приложение создано для эффективного изучения английских слов с предлогами. Мы предоставляем удобные инструменты и интересный контент для того, чтобы сделать процесс обучения увлекательным и результативным.
        </p>
        <h2 className="mt-4 text-primary ">Преимущества приложения:</h2>
        <ul className="p-0">
            <li><FaCheckCircle /><span className="presc">Большая база слов с разнообразными предлогами.</span></li>
            <li><FaCheckCircle /><span className="presc">Возможность отслеживать свой прогресс.</span></li>
            <li><FaCheckCircle /><span className="presc">Доступ к приложению из любой точки мира.</span></li>
        </ul>
        {!isAuthorizationUser && (<>
        <h2 className="mt-4 text-primary">Как начать изучение?</h2>
        <p>
            Для начала изучения просто <NavLink className='link' to="/register-user">зарегистрируйтесь</NavLink> на нашем сайте и начните использовать все возможности приложения. Вы сможете улучшить свой словарный запас, повысить уровень владения языком и достичь новых успехов в обучении!
        </p>
        </>)}
        <h2 className="mt-4 text-primary">Присоединяйтесь к нам уже сегодня!</h2>
        <p>
            Не упустите шанс улучшить свои знания английского языка. Присоединяйтесь к нам уже сегодня и начинайте путь к успешному изучению!
        </p>
    </div>
    )
}

export default Home;