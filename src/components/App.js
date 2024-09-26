import React, { useEffect } from "react";
import { useState } from "react";
import { BrowserRouter as Router,Routes, Route} from 'react-router-dom';
import Card from "./card/Card.js";
import FormRegister from "./register/Register.js";
import Login from "./login/Login.js";
import AboutCart from "./aboutCart/AboutCart.js";
import Navigation from "./navigation/Navigation.js";
import RestartGame from "./restartGame/RestartGame.js";
import UserSuccess from "./userSuccess/UserSucces.js";
import LogOut from "./logOut/LogOut.js";
import Home from "./home/Home.js";
import Progress from "./progress/Progress.js";
import '../index.css'
import 'bootstrap/dist/css/bootstrap.css'
import Footer from "./footer/Footer.js";
import EmailForChangePassword from "./writeEmailForChangePassword/EmailForChangePassword.js";
import ResetPassword from "./resetPassword/ResetPassword.js";

function App() {  

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState('');
  const [isAuthorizationUser, setIsAuthorizationUser] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setName(user);
      setIsLoggedIn(true)
      setIsAuthorizationUser(true)
    }
  },[])

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsAuthorizationUser(true);
  }
  const handleLogOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    setIsAuthorizationUser(false);
  }

  const getName = (name) => {
    setName(name);
    localStorage.setItem('user', JSON.stringify(name))
  }

  return (
       <Router>
          <Navigation isLoggedIn={isLoggedIn} name={name} />
          <div className="container">
            <div className="content">
              {isAuthorizationUser ? (
              <Routes >
                <Route path="/" element={<Home isAuthorizationUser={isAuthorizationUser} />}/>
                <Route path="/login-user" element={<Login handleLogin={handleLogin} getName={getName}/>} />
                <Route path="/register-user" element={<FormRegister handleLogin={handleLogin} getName={getName} />} />
                <Route path={`/progress/${name}`} element={<Progress name={name} />} />
                <Route path="/learn" element={<Card name={name} />} /> 
                <Route path="/learn/About" element={<AboutCart/>} />
                <Route path="/learn/At" element={<AboutCart/>} />
                <Route path="/learn/Away" element={<AboutCart/>} />
                <Route path="/learn/By" element={<AboutCart/>} />
                <Route path="/learn/Down" element={<AboutCart/>} />
                <Route path="/learn/Off" element={<AboutCart/>} />
                <Route path="/learn/Out" element={<AboutCart/>} />
                <Route path="/learn/Up" element={<AboutCart/>} />
                <Route path="/learn/AllQuestions" element={<AboutCart/>} />
                <Route path="/isRestartGame" element={<RestartGame />} />
                <Route path="/user-success" element={<UserSuccess name={name} />} />
                <Route path="/logout" element={<LogOut handleLogOut={handleLogOut} />} /> 
              </Routes>
              ) : (
                <Routes>
                  <Route path="/" element={<Home isAuthorizationUser={isAuthorizationUser}/>}/>
                  <Route path="/login-user" element={<Login handleLogin={handleLogin} getName={getName}/>} />
                  <Route path="/register-user" element={<FormRegister handleLogin={handleLogin} getName={getName}/>} />
                  <Route path="/set-password" element={<EmailForChangePassword/>}  />
                  <Route path="/reset-password" element={<ResetPassword/>}  />
                </Routes>
              )}
            </div>
          </div>
          <Footer />
        </Router>
  );
}

export default App;
