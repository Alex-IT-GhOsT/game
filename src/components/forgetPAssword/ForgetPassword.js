import React from "react";
import { NavLink } from "react-router-dom";
import './ForgetPassword.css';

const ForgetPassword = () => {

    return (
        <NavLink className='forgetPassword' to='/set-password'>Забыли пароль?</NavLink>
    )

}

export default ForgetPassword;