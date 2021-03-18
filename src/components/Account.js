import React, { useState } from 'react';
import './Account.css';

// IMAGE IMPORTS
import accountHeader from './site-images/account-center.png';
import emptyBox from './site-images/empty-box.png';

// MUI IMPORTS
import {ArrowForwardIos} from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';


// SUB-COMPONENTS
const UserPosts = ({myPosts, getPostDate}) => {
    const history = useHistory();
    const [whichPosts, setWhichPosts] = useState('active')
    const activePosts = myPosts.filter((post) => post.active);
    const inactivePosts = myPosts.filter((post) => !post.active);
    
    return (
        <section className="user-posts">
            <div className="section-header">
                <h1>Posts</h1>
            </div>

            <div className="messageboard-tabs">
                <button 
                    className={`messageboard-tab ${whichPosts === 'active' ? 'tab-active' : ''}`}
                    onClick={() => {
                        setWhichPosts('active');
                    }}
                    >ACTIVE</button>
                <button 
                    className={`messageboard-tab ${whichPosts === 'expired' ? 'tab-active' : ''}`}
                    onClick={() => {
                        setWhichPosts('expired');
                    }}
                    >EXPIRED</button>
            </div>

            <div className="post-list">

                { whichPosts === 'active' && activePosts.length < 1 || whichPosts === 'expired' && inactivePosts.length < 1
                ? <div className="empty-list"><img src={emptyBox}/>No posts to display.</div>

                : whichPosts === 'active' && activePosts.length >= 1
                ? activePosts.map((post) => {
                    return (
                        <div 
                            className="post" 
                            key={post._id}
                            onClick={() => {
                                history.push(`/marketplace/${post._id}`)
                            }}>
                            <div className="post-header">
                                <div className="post-title-container">
                                    <h2>{post.title}</h2>
                                    <h2>{post.price}</h2>
                                </div>
                            </div>

                            <div className="post-content">
                                
                                    <p>{post.description}</p>
                                
                                <div className="post-arrow-container">
                                    <ArrowForwardIos color="primary" size="large"></ArrowForwardIos>
                                </div>
                            </div>
                            <div className="post-time">
                                <p>Posted: {getPostDate(post)}</p>
                            </div>
                        </div>
                    );
                })

                : whichPosts === 'expired' && inactivePosts.length >= 1
                ? inactivePosts.map((post) => {
                    return (
                        <div 
                            className="post expired-post" 
                            key={post._id}>
                                
                            <div className="post-header">
                                <div className="post-title-container">
                                    <h2>{post.title}</h2>
                                    <h2>{post.price}</h2>
                                </div>
                            </div>

                            <div className="post-content">
                              
                                    <p>{post.description}</p>
                                
                            </div>
                            <div className="post-time">
                                <p>Posted: {getPostDate(post)}</p>
                            </div>
                        </div>
                    )
                }) 

                : ''}
            </div>
        </section>
    );
};




const UserMessages = ({messages, userData, posts}) => {
    const history = useHistory();
    const [messageBox, setMessageBox] = useState('inbox');
    const inboxMessages = messages.filter((message) => message.fromUser._id !== userData._id);
    const sentMessages = messages.filter((message) => message.fromUser._id === userData._id);

    const findAuthor = (message) => {
        const targetPost = posts.find((thisPost) => {return (thisPost._id === message.post._id )});
        if (targetPost) {
            return targetPost.author.username;
        } else {
            return "Unknown"
        };
    };
    
    return (
        <section className="user-messages">
            <div className="section-header"><h1>Messageboard</h1></div>
            
            <div className="messageboard-tabs">
                <button 
                    className={`messageboard-tab ${messageBox === 'inbox' ? 'tab-active' : ''}`}
                    onClick={() => {
                        setMessageBox('inbox');
                    }}
                    >INBOX</button>
                <button 
                    className={`messageboard-tab ${messageBox === 'sent' ? 'tab-active' : ''}`}
                    onClick={() => {
                        setMessageBox('sent');
                    }}
                    >SENT</button>
            </div>

            <div className="message-list">

                {messageBox === 'inbox' && inboxMessages.length < 1 || messageBox === 'sent' && sentMessages.length < 1
                ? <div className="empty-list"><img src={emptyBox}/>No messages to display.</div>

                : messageBox === 'inbox' && inboxMessages.length >= 1
                ? inboxMessages.map((message) => {
                    return (
                        <div 
                            className="message"
                            key={message._id}>

                            <div className="message-header">
                                <h3>From: <span className="username">{message.fromUser.username}</span></h3>
                            </div>

                            <div className="message-content">
                                    <p>{message.content}</p>

                                    <div className="respond-button-container">
                                        <Button 
                                            variant="contained" 
                                            color="primary"
                                            onClick={() => {
                                                history.push(`/marketplace/${message.post._id}`)
                                            }}>View Post</Button>
                                     </div>
                            </div>
                        </div>
                    );
                })

                : messageBox === 'sent' && sentMessages.length >= 1

                ? 

                sentMessages.map((message) => {

                    return (
                        <div 
                            className="message"
                            key={message._id}>

                            <div className="message-header">
                                <h3>To: <span className="username">{findAuthor(message)}</span></h3>
                            </div>

                            <div className="message-content">
                                <p>{message.content}</p>

                                <div className="respond-button-container">
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        disabled={posts.find((thisPost) => {return (thisPost._id === message.post._id )}) ? false : true}
                                        onClick={() => {
                                            history.push(`/marketplace/${message.post._id}`)
                                        }}>View Post</Button>
                                </div>
                            </div>
                        </div>
                    );
                })
                
                : ''}

            </div>
        </section>
    );
};


// DEFAULT COMPONENT
const Account = ({userData, getPostDate, posts}) => { 
    const {messages, posts: myPosts, username} = userData;
    const [showing, setShowing] = useState('posts');

    if (!myPosts || !messages) {return <main id="account">Loading...</main>};
    
    return (
        <main id="account">
            <section className="account-container">
                <div className="account-header-container">
                    <h1><img className="account-header" src={accountHeader} /></h1>
                </div>

                <div className="account-body">
                    <div className="welcome-user">
                        <h1>Welcome, <span className="username">{username}</span>!</h1>
                    </div>

                    <div className="account-nav-buttons">
                        <button 
                            className={`account-center-nav ${showing === 'posts' ? 'nav-tab-active' : ''}`}
                            onClick={() => {setShowing('posts')}}>POSTS</button>
                        <button
                            className={`account-center-nav ${showing === 'messages' ? 'nav-tab-active' : ''}`}
                            onClick={() => {setShowing('messages')}}>MESSAGES</button>
                    </div>

                    {showing === 'posts'
                    ? <UserPosts myPosts = {myPosts} getPostDate = {getPostDate} />
                    : <UserMessages messages = {messages} userData = {userData} posts = {posts} />
                    }
                </div>

            </section>
        </main>
    );
};

export default Account;