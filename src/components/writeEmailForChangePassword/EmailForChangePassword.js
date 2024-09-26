import React, { useEffect, useState } from "react";
import './EmailForChangePassword.css'
import { apiUrl } from "../../config.js";
import { NavLink, useNavigate } from "react-router-dom";
import EnterCode from "../enterCode/enterCode.js";

const EmailForChangePassword = () => {

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isFindEmail, setIsFindEmail] = useState(null);
    const [successOnEmail, setSuccessOnEmail] = useState(false);
    const [message, setMessage] = useState('');
    const [isValidateCode, setIsValidateCode] = useState(false)


    const handleChange = (e) => {
        setEmail(e.target.value)
    }

    const sendToServer = async (e) => {
        e.preventDefault();

        try{
            const response = await fetch(`${apiUrl}/check-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email})
            })

            const data = await response.json();
            if (!data.success) {
                setError(data.message)
                setIsFindEmail(false)
            } else {
                setIsFindEmail(true)
                setSuccessOnEmail(true)
                setMessage(data.message)
                setIsValidateCode(true)
            }

        }catch(error) {
            console.log(error)
        }
        
    }


    return (
        
        <div>
            {
                successOnEmail ? 
                <h1 className="error-block">{message}</h1> 
                :
                <>
                <h1>Введите свой адрес электронный почты</h1>
                <form className="emailBlockForChangePassword" onSubmit={sendToServer}>
                    <input 
                        className="form-control mb-2"
                        value={email}
                        onChange={handleChange} 
                        type="email" 
                        name="email" 
                        placeholder="Адрес электронной почты"
                        autoFocus
                        required/>
                    <button className="btn btn-primary" type="submit">Отправить</button>
                </form>
                {isFindEmail === false && 
                    <div className="error-block">{error}, пожалуйста<NavLink className='link' to="/register-user">зарегистрируйтесь.</NavLink> </div>
                }
                </>
            }
            {isValidateCode && <EnterCode />}
           
        </div>
    )
}

export default EmailForChangePassword;