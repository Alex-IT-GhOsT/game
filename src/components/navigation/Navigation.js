import React, { useEffect } from "react";
import {NavLink, useLocation } from "react-router-dom";
import './Navigation.css';
import {Navbar, Nav} from 'react-bootstrap';
import iconImage from '../../image/icon.png'

const Navigation = ({isLoggedIn, name}) => {

  const location = useLocation();

  useEffect(() => {
    const setPageTitle = () => {
      let newTitle = 'EngRus';

      switch (location.pathname) {
        case '/':
          newTitle = `Тренажер: ${name ? 'Моя главная страница' : 'Главная страница' }`;
          break;
        case '/learn': 
          newTitle = "Тренажер: Начать изучение";
          break;
        case `/progress/${name}`:
          newTitle = `Мой прогресс в тренажере, ${name}`;
          break;
        case '/logout':
          newTitle = "Выход из приложения";
          break;
        case '/login-user':
          newTitle = 'Вход в приложение';
          break;
        case '/register-user':
          newTitle = 'Зарегистрироваться в приложение';
          break;
        case '/learn/About':
          newTitle = 'Тренажер: Изучение предлога About';
          break;
        case '/learn/At':
          newTitle = 'Тренажер: Изучение предлога At';
          break;
        case '/learn/Away':
          newTitle = 'Тренажер: Изучение предлога Away';
          break;
        case '/learn/By':
          newTitle = 'Тренажер: Изучение предлога By';
          break;
        case '/learn/Down':
          newTitle = 'Тренажер: Изучение предлога Down';
          break;
        case '/learn/Off':
          newTitle = 'Тренажер: Изучение предлога Off';
          break;
        case '/learn/Out':
          newTitle = 'Тренажер: Изучение предлога Out';
          break;
        case '/learn/Up':
          newTitle = 'Тренажер: Изучение предлога Up';
          break;
        case '/learn/AllQuestions':
          newTitle = 'Тренажер: Изучение всех предлогов';
          break;
        case '/set-password':
          newTitle = `Тренажер: Ввод эл.почты для смены пароля`;
          break;
        case '/reset-password':
          newTitle = `Тренажер: Новый пароль`;
          break;
        default:
          break;
      }
      document.title = newTitle;
    };
    setPageTitle()
  },[location.pathname, name])
    
    return (
      <Navbar className="bg-dark p-3" expand="lg" variant="dark">
        <NavLink to='/' style={{ textDecoration: 'none' }}>
          <Navbar.Brand>
            <img src={iconImage} alt="Logo" width="30" height="24" className="d-inline-block align-text-top"/>
            EngRus
          </Navbar.Brand>
        </NavLink>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="w-100 justify-content-end">
          <NavLink className="nav-link" to="/" >
            <span>Главная страница</span>
          </NavLink>
          {isLoggedIn ? (
            <>
              <NavLink className="nav-link" to="/learn">
                <span>Начать изучение</span>
              </NavLink>
              <NavLink className="nav-link" to={`/progress/${name}`}>
                <span>Ваш прогресс, {name}</span>
              </NavLink>
              <NavLink className="nav-link" to="/logout">
                <span>Выход</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink className="nav-link" to="/login-user">
                <span>Вход</span>
              </NavLink>
              <NavLink className="nav-link" to="/register-user">
                <span>Зарегистрироваться</span>
              </NavLink>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  
      )
}

export default Navigation;