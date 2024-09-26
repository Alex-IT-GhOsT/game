import React from "react";
import { Link } from "react-router-dom";
import './UserSuccess.css'

const UserSuccess = ({name}) => {
 
    return (
        <>
            <div className="alert alert-success text-center" role="alert">
                 <div>
                     <h4 className="alert-heading">Добро пожаловать, {name}</h4>
                 </div>
                 <Link className="btn btn-primary" to='/learn'>Перейти к изучению</Link>
             </div>   
         </>  
    )
}

export default UserSuccess;