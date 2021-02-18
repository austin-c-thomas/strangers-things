import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {API_LOGIN, API_REGISTER, apiRequest} from './api/index';
import './Home.css';

// IMAGE IMPORTS
import logo from './site-images/strangers-logo.png';
import artwork from './site-images/homepage-artwork-02.png';


// MUI IMPORTS
import { Button, 
    FormControl, 
    InputLabel,
    OutlinedInput,
    Typography} from '@material-ui/core';
import {PersonAdd, Lock, KeyboardArrowRight} from '@material-ui/icons';


// SUB-COMPONENTS
const Intro = ({classes, setUserType}) => {

    return (
        <section className="intro">
            <img src={logo} />
                <div className="vertical-button-container">
                    <Button 
                        variant="contained"
                        className={classes.largeButton}
                        size="large" 
                        color="primary"
                        startIcon={<PersonAdd />}
                        onClick={() => {setUserType('new')}}
                        >REGISTER</Button>
                    <Button 
                        type="submit"
                        variant="outlined"
                        className={classes.largeButton}
                        size="large" 
                        color="primary"
                        startIcon={<Lock />}
                        onClick={() => {setUserType('existing')}}
                        >SIGN IN</Button>
                </div>
        </section>
    );
};

const Login = ({classes, setUserType, setUserToken}) => {
    const history = useHistory();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const handleLoginSubmit = async (event) => {
        event.preventDefault();

        const object = await apiRequest({
            url: API_LOGIN,
            method: 'POST',
            body: {
                user: {
                    username: username,
                    password: password
                },
            },
        });

        const token = object.data.token;
        if (token) {
            localStorage.setItem ('userToken', token);
            setUsername('');
            setPassword('');
            setUserType('');
            setUserToken(token);
        };

        history.push('/welcome');

    };

    return (
        <div className="login"> 
            <Typography 
                variant="h2"
                color="primary">Sign In</Typography>
            <form className="login-form" onSubmit={handleLoginSubmit}>
                <FormControl fullWidth variant="outlined" className={classes.formInput}>
                    <InputLabel htmlFor="username-input">Username</InputLabel>
                    <OutlinedInput 
                        color="primary"
                        id="username-input"
                        value={username}
                        onChange={(event) => {setUsername(event.target.value)}}
                        required={true}
                        labelWidth={80}
                        />
                </FormControl>  

                <FormControl fullWidth variant="outlined" className={classes.formInput}>
                    <InputLabel htmlFor="password-input">Password</InputLabel>
                    <OutlinedInput 
                        type="password"
                        color="primary"
                        id="description-input"
                        value={password}
                        onChange={(event) => {setPassword(event.target.value)}}
                        required={true}
                        labelWidth={80}
                        />
                </FormControl>    

                <div className="vertical-button-container">
                    <Button 
                        type="submit"
                        variant="contained"
                        className={classes.mediumButton}
                        size="large" 
                        color="primary"
                        startIcon={<Lock />}
                        >SIGN IN</Button>
                    <Button 
                        variant="outlined"
                        className={classes.mediumButton}
                        size="large" 
                        color="primary"
                        onClick={() => {setUserType('')}}
                        >BACK</Button>
                </div>
            </form>
        </div>
    );
};

const Register = ({classes, setUserType, setUserToken}) => {
    const history = useHistory(); 
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        console.log(newPassword === confirmPassword)

        if (newPassword === confirmPassword) {
            const object = await apiRequest({
                url: API_REGISTER,
                method: 'POST',
                body: {
                    user: {
                        username: newUsername,
                        password: newPassword
                    },
                },
            });
            
            const token = object.data.token;
            if (token) {
                localStorage.setItem ('userToken', token);
                setNewUsername('');
                setNewPassword('');
                setConfirmPassword('');
                setUserType('');
                setUserToken(token);
            };

            history.push('/welcome');

        } else {
            console.error('Passwords do not match!')
        };
    };

    return (
        <div className="register"> 
            <Typography 
                variant="h2"
                color="primary">Register</Typography>

            <form className="login-form" onSubmit={handleRegisterSubmit}>
                <FormControl fullWidth variant="outlined" className={classes.formInput}>
                    <InputLabel htmlFor="username-input">Desired Username</InputLabel>
                    <OutlinedInput 
                        color="primary"
                        id="username-input"
                        value={newUsername}
                        onChange={(event) => {setNewUsername(event.target.value)}}
                        required={true}
                        labelWidth={140}
                        inputProps={{ minLength: 3 }}
                        />
                </FormControl>  

                <FormControl fullWidth variant="outlined" className={classes.formInput}>
                    <InputLabel htmlFor="password-input">Desired Password</InputLabel>
                    <OutlinedInput 
                        color="primary"
                        id="password-input"
                        type="password"
                        required={true}
                        labelWidth={140}

                        value={newPassword}
                        onChange={(event) => {setNewPassword(event.target.value)}}
                        inputProps={{ minLength: 8 }}
                        />
                </FormControl>

                <FormControl fullWidth variant="outlined" className={classes.formInput}>
                    <InputLabel htmlFor="confirm-password-input">Confirm Password</InputLabel>
                    <OutlinedInput 
                        color="primary"
                        id="confirm-password-input"
                        type="password"
                        required={true}
                        labelWidth={140}

                        value={confirmPassword}
                        onChange={(event) => {setConfirmPassword(event.target.value)}}
                        inputProps={{ minLength: 8 }}
                        />
                </FormControl>      

                <div className="vertical-button-container">
                    <Button 
                        type="submit"
                        variant="contained"
                        className={classes.mediumButton}
                        size="large" 
                        color="primary"
                        startIcon={<PersonAdd />}
                        >REGISTER</Button>
                    <Button 
                         variant="outlined"
                        className={classes.mediumButton}
                        size="large" 
                        color="primary"
                        onClick={() => {setUserType('')}}
                        >BACK</Button>
                </div>   
            </form>
        </div>
    );
};


// DEFAULT COMPONENT
const Home = ({classes, setUserToken, userType, setUserType}) => {
    return (
        <main id="home">
            <div className="login-slide">
                {userType === '' 
                    ? <Intro 
                        classes = {classes}
                        setUserType = {setUserType} />
                    : userType === 'new'
                    ? <Register 
                        classes = {classes}
                        setUserType = {setUserType} 
                        setUserToken = {setUserToken} />
                    : <Login 
                        classes = {classes}
                        setUserType = {setUserType} 
                        setUserToken = {setUserToken}/>
                }
            </div>

            <div className="artwork-container">
                <img src={artwork} />
                
                <Link to="/marketplace"><Button 
                        variant="outlined"
                        className={classes.mediumButton}
                        size="large" 
                        color="secondary"
                        endIcon={<KeyboardArrowRight/>}
                        onClick={() => {setUserType('')}}
                        >VISIT MARKETPLACE</Button></Link>
            </div>
        </main>
    );
};

export default Home;