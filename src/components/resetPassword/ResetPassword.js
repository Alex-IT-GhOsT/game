import React, { useEffect, useState } from "react";
import { apiUrl } from "../../config.js";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {

    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [isSuccessPaswword, setIsSuccessPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate()

    const handleChange = (e) => {
        setNewPassword(e.target.value);
        setError('')
    }

    const sendToServer = async(e) => {
        e.preventDefault();
        const token = localStorage.getItem('token')
        try{
            const response = await fetch(`${apiUrl}/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`, 
                },
                body: JSON.stringify({newPassword})
            })

            const data = await response.json()
            console.log(data)
            if (data.success) {
                setIsSuccessPassword(true);
                setSuccessMessage(data.message)
            } else {
                setIsSuccessPassword(false);
                setError(data.message)
            }

        }catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        if (isSuccessPaswword) {
            const timer = setTimeout(() => {
                 navigate('/login-user')
            },5000)

            return () => {
                clearTimeout(timer)
            }
           
        }
    },[isSuccessPaswword])

    

    return (
        <div className="d-grid justify-content-center">
        {isSuccessPaswword ? <h2 className="success-block">{successMessage}</h2>  :
        <form className="form" onSubmit={sendToServer}>
            <label htmlFor="passCode">Введите новый пароль</label>
            <input className="form-control mb-2"
            name='passCode' 
            type='password'
            onChange={handleChange}
            value={newPassword}
            autoFocus
            required
            />
            <button className="btn btn-primary" type="submit">Подтвердить пароль</button>
        </form>}
        <div className="text-center">{error}</div>
    </div>
    )
}

export default ResetPassword;