import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';

import logo from './site-images/strangers-logo.png';

import { IconButton } from '@material-ui/core';       
import { AccountCircleOutlined, Close, Lock } from '@material-ui/icons';

const ProfileDropdown = ({setSubnavOpen, currentUser, setUserData, setUserToken}) => {

    return (
        <div className="subnav">

            <IconButton
                className="close-button" 
                size="small"
                onClick={() => setSubnavOpen(false)}
                >{<Close color="primary" size="large" fontSize="large"/>}</IconButton>
           
            <div className="subnav-header">
                {currentUser 
                    ? <h2>Welcome, <br></br> <span className="username">{currentUser}</span>!</h2> 
                    : <div>
                        <h2>No User</h2>
                        <h5>Please Register<br></br> or Sign In</h5>
                    </div>}

                <div className="profile-circle">
                    {currentUser ? <h3>{currentUser.charAt(0)}</h3> : <Lock />}
                </div>
            </div>

            <ul>
                {currentUser 
                ? <li><button onClick={() => setSubnavOpen(false)}><Link to="/account" >Account</Link></button></li>
                : ''}

                <li><button onClick={() => setSubnavOpen(false)}><Link to="/marketplace" >Marketplace</Link></button></li> 

                {currentUser 
                ? <li>
                    <button onClick={() => setSubnavOpen(false)}>
                        <Link to="/logout" 
                            className="logout"
                            onClick={() => {
                                localStorage.clear();
                                setUserData({});
                                setUserToken('');
                            }}>Log Out</Link></button></li>
                : <li><button onClick={() => setSubnavOpen(false)}><Link to="/"><span className="username">Sign In{"/"}Register</span></Link></button></li>}           
            </ul>
        </div>
    );
};

const Header = ({userData, setUserData, setUserToken}) => {
    const [subnavOpen, setSubnavOpen] = useState(false);
    const currentUser = userData.username;

    return (
        <header>
            <Link to="/" className="header-logo"><img src={logo} alt="Stranger's Things"/></Link>
            <nav className="header-nav">
                <ul>
                    <li><button 
                            className="profile-button"
                            onClick={(event) => {
                                event.preventDefault();
                                setSubnavOpen(!subnavOpen)}}>
                        <AccountCircleOutlined fontSize="large"/></button></li>
                </ul>
            </nav>
            {subnavOpen
            ? <ProfileDropdown 
                setSubnavOpen={setSubnavOpen} 
                currentUser = {currentUser}
                setUserData = {setUserData}
                setUserToken = {setUserToken}/>
            : ''}
        </header>
    );
};

export default Header;