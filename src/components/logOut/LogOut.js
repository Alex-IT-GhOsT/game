import React from "react";
import { Link } from "react-router-dom";


const LogOut = ({handleLogOut}) => {

    return (
        <div className="alert alert-danger text-center" role="alert">
        <div>
            <h4 className="alert-heading">Вы уверены что хотите выйти из аккаунта?</h4>
        </div>
        <Link onClick={handleLogOut} className="btn btn-primary" to='/'>Выйти</Link>
    </div> 
    )
}

export default LogOut;