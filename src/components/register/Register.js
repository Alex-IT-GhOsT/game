import React, { useState } from "react";
import Card from "../card/Card.js";
import { Link } from "react-router-dom";
import { apiUrl, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, MIN_NAME_LENGTH, MAX_NAME_LENGTH } from "../../config.js";
import UserSuccess from "../userSuccess/UserSucces.js";
import { ImEye } from "react-icons/im";
import { ImEyeBlocked } from "react-icons/im";
import './Register.css'



const FormRegister = ({handleLogin, getName}) => {

    const [formDate, setFormDate] = useState({
        name: '',
        password: '',
        email: ''
    })
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [messageServer, setMessageServer] = useState(null);
    const [againReg, setAgainReg] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormDate((prevForm) => ({
            ...prevForm, 
            [name] : value
        }))
        setError(null);
    }

    const successUser = () => {
        handleLogin();
    }

    const validateName = (name) => {
        if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
            return false;
        } else {
            return true;
        }

    }

    const validatePassword = (password) => {
        if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
            return false;
        }
        const hasLetter = /[a-zA-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

        return hasLetter && hasNumber && hasSpecialChar;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePassword(formDate.password)) {
            setError("Пароль должен содержать буквы, цифры и специальные символы, а так же должно быть минимум 8 символов.");
            return;
        }

        if(!validateName(formDate.name)) {
            setError("Имя должно состоять от 3 до 30 символов.");
            return;
        }
        
        try{
            const response = await fetch(`${apiUrl}/register-user`, {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDate)
            });

            if (response.status === 400) {
                setError('Заполните все обязательные поля');
                return;
            }
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('token1', data.authorization);
                setRegistrationSuccess(true);
                successUser();
                getName(formDate.name)
            } else {
                setAgainReg(true);
                setMessageServer(data.message);
                setRegistrationSuccess(false);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return <>
        {!registrationSuccess ? <>
            <div className="text-center p-3">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <form className="form-signin w-100 m-auto " onSubmit={handleSubmit}>
                            <h1 className="h3 mb-3 font-weigth-normal">Регистрация</h1>
                            <input className="form-control mb-2"
                                type="text"
                                name="name"
                                value={formDate.name}
                                onChange={handleChange}
                                placeholder="Ваше имя"
                                autoFocus
                                required/>
                            <input 
                                className="form-control  mb-2"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formDate.password}
                                onChange={handleChange}
                                placeholder="Пароль"
                                required/>
                            {!showPassword ? 
                                <span onClick={handleShowPassword} className="eys"><ImEyeBlocked /></span>
                                :
                                <span onClick={handleShowPassword} className="eys"><ImEye /></span>
                            }
                            <input 
                                className="form-control  mb-2"
                                type="email"
                                name="email"
                                value={formDate.email}
                                onChange={handleChange}
                                placeholder="Электронная почта"
                                required/>
                            <input className="btn btn-primary btn-lg btn-block" type="submit" value='Зарегистрироваться'/>
                        </form>
                    </div>
                </div>
            </div>
            {againReg && <div className="alert alert-primary text-center mt-3" role="alert">
                {messageServer}
                <button className="btn btn-danger"  onClick={() => setAgainReg(false)}>&times;</button>
                </div>}
        </> :  <UserSuccess name={formDate.name} />
        }
        {error && (
        <div className="alert alert-danger text-center" role="alert">
            {error}
            <button className="btn btn-danger" onClick={() => setError(null)}>
                &times;
            </button>
        </div>
    )}
    </>
}

export default FormRegister;