import React from 'react';
import {Link} from 'react-router-dom';

// IMAGE IMPORTS
import artwork from './site-images/homepage-artwork-02.png';

// MUI IMPORTS
import {Button} from '@material-ui/core';
import {ArrowForwardIos} from '@material-ui/icons';

// DEFAULT COMPONENT
const LoggedIn = ({
    classes, 
    userType, 
    userData}) => {

    return(
        <main id="login">
            <div className="login-container">
                <h1>Welcome <span className="username">{userData.username}</span>!</h1>
                <img src={artwork}/>
                <h2>You have successfully {userType === "new" ? "registered." : "signed in."}</h2>
                <h3>Let's get strange.</h3>
                <Link to="/marketplace">
                    <Button 
                        variant="outlined" 
                        color="primary" 
                        className={classes.largeButton}
                        endIcon={<ArrowForwardIos />}>
                        To the Marketplace</Button></Link>
            </div>
        </main>
    );
};

export default LoggedIn;