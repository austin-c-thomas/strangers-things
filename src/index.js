import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import { apiRequest, API_ME, API_POSTS } from './components/api';
import './style.css';

// COMPONENT IMPORTS
import {
    Header,
    Home,
    LoggedIn,
    LoggedOut,
    Marketplace,
    Post,
    Account} from './components';

// MUI IMPORTS & THEMES
import {makeStyles, ThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {orange, grey} from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    formInput: {
        marginTop: 12,
        marginBottom: 12,
    },
    largeButton: {
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 20,
        paddingBottom: 20,
        marginTop: 8,
        marginBottom: 8,
    },
    mediumButton: {
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 15,
        paddingBottom: 15,
        marginTop: 8,
        marginBottom: 8,
    },
    searchBar: {
        borderRadius: 100,
        fontSize: 20,
    },
    searchIcon: {
        padding: 50,
    }

    }));

const theme = createMuiTheme({
palette: {
    primary: {
        main: orange[800],
    },
    secondary: {
        main: grey[50],
    },
}
});


// HELPER FUNCTIONS
const fetchUserData = async (token) => {
    const {data} = await apiRequest({
        url: API_ME,
        token,
    });
    return data;
};

const fetchPosts = async () => {
    try {
        const object = await apiRequest({
            url: API_POSTS,
        });
        return object.data.posts;
    } catch(error) {
        console.error(error)
    };
};

const getPostDate = (post) => {
    const postYear = post.createdAt.charAt(0) + post.createdAt.charAt(1) + post.createdAt.charAt(2) + post.createdAt.charAt(3)
    const postDay = post.createdAt.charAt(5) + post.createdAt.charAt(6)
    const postMonth = post.createdAt.charAt(8) + post.createdAt.charAt(9)
    const postMinute = post.createdAt.charAt(14) + post.createdAt.charAt(15);

    const postHour = () => {
        let hour = post.createdAt.charAt(11) + post.createdAt.charAt(12);
        if (post.createdAt.charAt(11) === 0) {
            hour = post.createdAt.charAt(12);
        } else if (hour > 12) {
            hour = hour - 12
        };
        return hour;                        
    };

    const meridiem = () => {
        const hour = Number((post.createdAt.charAt(11) + post.createdAt.charAt(12)));
        if (hour > 12) {
            return 'PM'
        } else {
            return 'AM'
        };
    };
    return `${postHour()}:${postMinute}${meridiem()} GMT ${postDay}/${postMonth}/${postYear}`
};


// APP

const App = () => {
    const classes = (useStyles());
    const [userType, setUserType] = useState('');
    const [userToken, setUserToken] = useState('');
    const [userData, setUserData] = useState({});
    const [posts, setPosts] = useState([]);

    useEffect(async() => {
        const posts = await fetchPosts();
        if (posts) {
            setPosts(posts);
        };
    }, []);

    useEffect(async () => {
        if (!userToken) {
            setUserToken(localStorage.getItem('userToken'));
            return;
        };
        const data = await fetchUserData(userToken);
        if (data && data.username) {
            setUserData(data);
        };
    }, [userToken])

    return (
        <div id="app">
        <ThemeProvider theme={theme}>
            <Header
                userData = {userData}
                setUserData = {setUserData}
                setUserToken = {setUserToken}/>
            <Switch>
                <Route exact path="/">
                    <Home 
                        classes = {classes}
                        setUserToken = {setUserToken}
                        userType = {userType}
                        setUserType = {setUserType}/>
                </Route>
                <Route exact path="/marketplace">
                    <Marketplace 
                        classes = {classes}
                        userToken = {userToken}
                        posts = {posts}
                        getPostDate = {getPostDate}/>
                </Route>

                <Route path="/marketplace/:postId">
                    <Post 
                        classes = {classes}
                        posts = {posts}
                        userData = {userData} 
                        userToken = {userToken}
                        getPostDate = {getPostDate}/>
                </Route>    

                <Route path="/account">
                    <Account 
                        userData = {userData}
                        getPostDate = {getPostDate}
                        posts = {posts}/>
                </Route>
                
                <Route path="/logout">
                    <LoggedOut 
                        classes = {classes}/>
                </Route>

                <Route path="/welcome">
                    <LoggedIn 
                        classes = {classes} 
                        userType = {userType} 
                        userData = {userData}/>
                </Route>

            </Switch>
        </ThemeProvider>    
        </div>
    );
};

ReactDOM.render(
    <Router>
        <App />
    </Router>, 
    document.getElementById('root'));