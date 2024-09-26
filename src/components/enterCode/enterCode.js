import React, { useEffect, useState } from "react";
import './enterCode.css';
import { apiUrl } from "../../config.js";
import { useNavigate } from "react-router-dom";

const EnterCode = () => {

    const [passCode, setPassCode] = useState('');
    const [isValidCode, setIsValidCode] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setPassCode(e.target.value);
        setError('');
    }

    const sendToServer = async(e) => {
        e.preventDefault();
        localStorage.setItem('token', passCode);
        try{
            const response = await fetch(`${apiUrl}/check-validationCode`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({passCode})
            })

            const data = await response.json();
            if (data.success) {
                setIsValidCode(true)
            } else {
                setIsValidCode(false)
                setError(data.message)
            }

        }catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
       if (isValidCode) {
        navigate('/reset-password');
       }
    },[isValidCode])

    return (
        
        <div className="d-grid justify-content-center ">
            <form className="form" onSubmit={sendToServer}>
                <label htmlFor="passCode">Введите 4-х значный код</label>
                <input className="form-control mb-2"
                name='passCode' 
                type='number'
                onChange={handleChange}
                value={passCode}
                autoFocus
                required
                />
                <button className="btn btn-primary" type="submit">Подтвердить код</button>
            </form> 
            <div>{error}</div>
            
        </div>
    )
}

export default EnterCode;