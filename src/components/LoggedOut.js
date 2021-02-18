import React from 'react';
import {Link} from 'react-router-dom';

// IMAGE IMPORTS
import artwork from './site-images/logout-artwork.png';

// MUI IMPORTS
import {Button} from '@material-ui/core';

// DEFAULT COMPONENT
const LoggedOut = ({classes}) => {
    return(
        <main id="logout">
            <div className="logout-container">
                <img src={artwork}/>
                    <h1>You have been successfully logged out.</h1>
                    <h3>Stay strange.</h3>
                    <Link to="/">
                        <Button variant="contained" color="primary" className={classes.largeButton}>
                            Return Home</Button></Link>
            </div>
        </main>
    );
};

export default LoggedOut;