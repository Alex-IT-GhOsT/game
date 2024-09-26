import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import { apiUrl, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from "../../config.js";
import { ImEye } from "react-icons/im";
import { ImEyeBlocked } from "react-icons/im";
import ForgetPassword from "../forgetPAssword/ForgetPassword.js";
import './Login.css'


const Login = ({handleLogin, getName}) => {
    
   
    const navigate = useNavigate();
    const [isUser, setIsUser] = useState({
        email: '',
        password: '',
    })
    const [isReg, setIsReg] = useState(null);
    const [mes, setMes] = useState('');
    const [servMes, setServMes] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
   

    const succesUser = () => {
        handleLogin();
    }

    const handleChange = (e) => {
        const {name, value} = e.target
        setIsUser((prev) => ({
            ...prev, 
                [name] : value
            }  
        ))
    }

   

    const sendToServer = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch(`${apiUrl}/check-user`, {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(isUser)
            })
            const data = await response.json();
            if (data.success) {
                setIsReg(true);
                getName(data.name);
                succesUser();
                localStorage.setItem('token', data.authorization);
            } else {
                setIsReg(false);
                setServMes(true);
                setMes('Такой пользователь не зарегистрирован или неправильное имя пользователя или пароль');
            }
        }catch (err) {
            console.log(err);
        }
    }

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }
    
    useEffect(() => {
        if (isReg) {
            navigate('/user-success');
        }
    },[isReg])

    return <>
     {!isReg && <>
            <div className="text-center row justify-content-center p-3">
                <div className="col-md-6">
                    <form className="form-signin w-100 m-auto " onSubmit={sendToServer} >
                        <h1 className="h3 mb-3 font-weigth-normal">Вход в свой кабинет</h1>
                        <input 
                            type="email" 
                            id="inputEmail" 
                            className="form-control mb-2" 
                            placeholder="Электронная почта"
                            name="email" 
                            value={isUser.email}
                            onChange={handleChange}
                            required 
                            autoFocus
                        />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            id="inputPassword"
                            name="password" 
                            className="form-control" 
                            placeholder="Пароль" 
                            value={isUser.password}
                            onChange={handleChange}
                            required 
                        />
                        {!showPassword ? 
                            <span onClick={handleShowPassword} className="eys"><ImEyeBlocked /></span>
                            :
                            <span onClick={handleShowPassword} className="eys"><ImEye /></span>
                        }
                        <div className="checkbox mb-3 mt-3 d-flex justify-content-around align-content-top">
                            <label htmlFor="checkbox">
                                <input type="checkbox" id="checkbox"  value="remember-me"/>
                                    <span style={{paddingLeft: '5px'}}>Запомнить меня</span>
                            </label>
                            <ForgetPassword />
                        </div>
                        <button className="btn btn-lg btn-primary btn-block" type="submit">Вход</button>
                    </form>
                </div>
            </div>
        
        {servMes && <div className="alert alert-danger text-center" role="alert">
            {mes}
            <button className="btn btn-danger"  onClick={() => setServMes(false)}>&times;</button>
            </div>
        }
     </>
        }  
    </>
}
export default Login;