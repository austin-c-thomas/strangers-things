import React, {useEffect, useState} from 'react';
import {useHistory, useParams, Link} from 'react-router-dom';
import {API_POSTS, apiRequest} from './api/index';
import './Post.css';

// MUI IMPORTS
import {FormControl,
        FormControlLabel, 
        InputLabel, 
        OutlinedInput, 
        InputAdornment,
        Button,
        Checkbox,
        IconButton} from '@material-ui/core';
import {KeyboardArrowLeft, Close, KeyboardArrowDown} from '@material-ui/icons';


// ACTION FUNCTIONS
const editPost = async (
    {postId, 
    newTitle, 
    newDescription,
    newPrice,
    newLocation,
    newWillDeliver,
    token}) => {

    const editRequest = await apiRequest({
        url: `${API_POSTS}/${postId}`,
        method: 'PATCH',
        body: {
            post: {
                title: newTitle,
                description: newDescription,
                price: newPrice,
                location: newLocation,
                willDeliver: newWillDeliver,
            },
        },
        token: token,
    });
};

const deletePost = async ({postId, token}) => {
    const deleteRequest = await apiRequest({
        url: `${API_POSTS}/${postId}`,
        method: 'DELETE',
        token: token,
    });
    window.location.reload();
    return(false);
};

const sendMessage = async ({postId, messageContent, token}) => {
    const messageRequest = await apiRequest({
        url: `${API_POSTS}/${postId}/messages`,
        method: 'POST',
        body: {
            message: {
                content: messageContent,
            },
        },
        token: token,
    });
};


// SUB-COMPONENTS
const Editor = ({classes, userToken, post, setEditorOpen}) => {  
    const [title, setTitle] = useState(post.title);
    const [description, setDescription] = useState(post.description);
    const [price, setPrice] = useState(post.price);
    const [location, setLocation] = useState(post.location);
    const [willDeliver, setWillDeliver] = useState(post.willDeliver);
    
    const handleEditSubmit = async (event) => {
        event.preventDefault();

        const editRequest = await editPost({
            postId: post._id, 
            newTitle: title, 
            newDescription: description,
            newPrice: price,
            newLocation: location,
            newWillDeliver: willDeliver,
            token: userToken,
        });
         
        setEditorOpen(false);
        window.location.reload();
        return(false);
    };

    return (
        <section className="post-editor">
            <div className="editor-header">
                    <h1>EDIT POST</h1>
                    <IconButton 
                        size="small"
                        onClick={() => setEditorOpen(false)}
                        >{<Close color="primary" size="large" fontSize="large"/>}</IconButton>             
            </div>
            <form className="post-editor-form" onSubmit={handleEditSubmit}>
                <FormControl fullWidth variant="outlined" className={classes.formInput} color="primary">
                    <InputLabel htmlFor="title-input">Title*</InputLabel>
                    <OutlinedInput 
                        color="primary"
                        id="title-input"
                        value={title}
                        onChange={(event) => {setTitle(event.target.value)}}
                        required={true}
                        startAdornment={<InputAdornment position="start"></InputAdornment>}
                        labelWidth={36}
                        />
                </FormControl>  

                <FormControl fullWidth variant="outlined" className={classes.formInput}>
                    <InputLabel htmlFor="description-input">Description*</InputLabel>
                    <OutlinedInput 
                        color="primary"
                        id="description-input"
                        value={description}
                        onChange={(event) => {setDescription(event.target.value)}}
                        required={true}
                        multiline rows={6}
                        startAdornment={<InputAdornment position="start"></InputAdornment>}
                        labelWidth={86}
                        />
                </FormControl>    

                <FormControl fullWidth variant="outlined" className={classes.formInput}>
                    <InputLabel htmlFor="price-input">Price*</InputLabel>
                    <OutlinedInput 
                        color="primary"
                        id="price-input"
                        value={price}
                        onChange={(event) => {setPrice(event.target.value)}}
                        required={true}
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        labelWidth={42}
                        />
                </FormControl>

                <FormControl fullWidth variant="outlined" className={classes.formInput} color="primary">
                    <InputLabel htmlFor="location-input">Location</InputLabel>
                    <OutlinedInput 
                        color="primary"
                        id="location-input"
                        value={location}
                        onChange={(event) => {setLocation(event.target.value)}}
                        startAdornment={<InputAdornment position="start"></InputAdornment>}
                        labelWidth={62}
                        />
                </FormControl> 

                <FormControlLabel 
                    className={classes.formInput}
                    label="I will deliver this item."
                    labelPlacement="start"
                    control={
                        <Checkbox 
                            color="primary"
                            checked={willDeliver}
                            onChange={(event) => {setWillDeliver(event.target.checked)}}
                            inputProps={{'aria-label': '"Will Deliver" Checkbox'}}
                        />}/> 
                <Button
                    variant="outlined"
                    className={classes.mediumButton}
                    size="large"
                    color="primary"
                    onClick={() => {
                        setEditorOpen(false);
                    }}
                    >Cancel</Button>
                <Button 
                    type="submit"
                    variant="contained"
                    className={classes.mediumButton}
                    size="large" 
                    color="primary"
                    >Save</Button>
            </form>
        </section>
    );
};


const MessageForm = ({classes, post, setSendMessageOpen, userToken, setMessageSent}) => {
    const [newMessage, setNewMessage] = useState('');
    const [messageConfirmationOpen, setMessageConfirmationOpen] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setMessageConfirmationOpen(true);
    };

    return (
        <div className="new-message-form">
            <h3>Interested? Leave <span className="username">{post.author.username}</span> a message!</h3>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth variant="outlined" className={classes.formInput}>
                    <InputLabel htmlFor="new-message-input">Message</InputLabel>
                    <OutlinedInput 
                        color="primary"
                        id="new-message-input"
                        value={newMessage}
                        onChange={(event) => {setNewMessage(event.target.value)}}
                        multiline rows={6}
                        labelWidth={86}
                        required={true}
                        inputProps={{ minLength: 3 }}
                        />
                </FormControl>
                <div className="buttons-section">
                    <Button variant="outlined" color="primary" onClick={() => {setSendMessageOpen(false)}}>Cancel</Button>  
                    <Button variant="contained" color="primary" type="submit">Send Message</Button>
                </div> 
            </form>

            {messageConfirmationOpen 
            ? <MessageConfirmation 
                newMessage = {newMessage} 
                setNewMessage = {setNewMessage}
                setMessageConfirmationOpen = {setMessageConfirmationOpen}
                setSendMessageOpen = {setSendMessageOpen}
                post = {post}
                userToken = {userToken}
                setMessageSent = {setMessageSent} /> 
            : ''}

        </div>
    );
};

const Messages = ({myMessages}) => {
    return (
        <div className="my-messages-container">
            <div className="my-message-list">
                {myMessages.map((message) => {
                    return (
                        <div 
                            className="message"
                            key={message._id}>

                            <div className="message-header">
                                <h3>From: <span className="username">{message.fromUser.username}</span></h3>
                            </div>

                            <div className="message-content">
                                    <p>{message.content}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

const MessageConfirmation = ({newMessage, setNewMessage, setMessageConfirmationOpen, setSendMessageOpen, post, userToken, setMessageSent}) => {

    const handleSubmit = async (event) => {
        event.preventDefault();
        sendMessage({
            postId: post._id,
            messageContent: newMessage,
            token: userToken,
        });
        setMessageConfirmationOpen(false);
        setSendMessageOpen(false);
        setMessageSent(true);
        setNewMessage('');        
    };

    return (
        <div className="confirmation-window">
            <form onSubmit={handleSubmit}>
                <h3>Send this message to <span className="username">{post.author.username}</span>?</h3>
                <p className="data">{newMessage}</p>
                
                <div className="confirmation-buttons">
                    <Button 
                        variant="outlined" 
                        color="primary"
                        onClick={() => {
                            setMessageConfirmationOpen(false);
                        }}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        color="primary"
                        type="submit"
                        >Send</Button>      
                </div>
            </form>            
        </div>
    );

};  
       
const DeleteConfirmation = ({setDeleteConfirmationOpen, post, userToken}) => {
    return (
        <div className="confirmation-window delete">
            <h3>Delete this post?</h3>            
            <div className="confirmation-buttons">
                <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={() => {
                        setDeleteConfirmationOpen(false);
                    }}>Cancel</Button>
                <Link to="/marketplace"><Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => {
                        console.log('Delete Post'); 

                        deletePost({
                            postId: post._id,
                            token: userToken,
                        });
                        setDeleteConfirmationOpen(false);
                    }}>Delete</Button></Link>
            </div>
        </div>
    );
}; 


// DEFAULT COMPONENT
const Post = ({classes, posts, userData, userToken, getPostDate}) => {
    const history = useHistory();
    const {postId} = useParams();
    const post = posts.find((post) => postId === post._id); 
    const [sendMessageOpen, setSendMessageOpen] = useState(false);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [editorOpen, setEditorOpen] = useState(false);
    const [myMessagesOpen, setMyMessagesOpen] = useState(false);

    const [messageSent, setMessageSent] = useState(false);
    const [successMessageOpen, setSuccessMessageOpen] = useState(false);

    useEffect(() => {
        if (messageSent) {
            setSuccessMessageOpen(true);
        }; 
    }, [messageSent])

    if (!post) {return <main id="post-view">Loading...</main>}; 

    let myMessages = [];
    if (userData.posts && userData._id === post.author._id) {
        myMessages = userData.posts.filter((mypost) => mypost._id === post._id)[0].messages;
    };

    return (
        <main id="post-view">
            <div className="back">
                <Button 
                    variant="outlined" 
                    color="primary" 
                    startIcon={<KeyboardArrowLeft/>}
                    onClick={() => {
                        history.push('/marketplace')
                    }}>Return to Marketplace</Button>
            </div>
            <div className="single-post">
                <div className="single-post-header">
                    <h1>{post.title}</h1>
                    <h3>{post.author.username}</h3>
                </div>

                <div className="post-time">
                    <p>Posted: {getPostDate(post)}</p>
                </div>

                <div className="single-post-body">
                    <div className="single-post-content">
                        <div className="data-pair">
                            <h4 className="data-type">Description</h4>
                            <span className="data">{post.description}</span>
                        </div>

                        <div className="data-pair">
                            <h4 className="data-type">Price</h4>
                            <span className="data">{post.price}</span>
                        </div>

                        <div className="data-pair">
                            <h4 className="data-type">Location</h4>
                            <span className="data">{post.location !== "[On Request]" ? post.location : '(Unprovided)'}</span>
                        </div>

                        <div className="data-pair">
                            <h4 className="data-type">Willing to deliver?</h4>
                            <span className="data">{post.willDeliver ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                </div>

                <div className="actions-section">
                    {userData._id === post.author._id
                    ? <>
                        <Button 
                            variant="outlined" 
                            color="primary"
                            onClick={() => {
                                setEditorOpen(true);
                            }}>Edit Post</Button>
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={() => {
                                setDeleteConfirmationOpen(true);
                            }}>Delete Post</Button>
                    </>
                    : <>
                        <Button 
                            variant="contained" 
                            color="primary"
                            disabled={
                                !userData._id ? true
                                : sendMessageOpen ? true : false
                            }
                            onClick={() => {
                                setMessageSent(false);
                                setSuccessMessageOpen(false);
                                setSendMessageOpen(true);
                            }}>Message</Button>
                    </>}   
                </div>

                {!userData._id 
                ? <span className="unauthorized-disclaimer">Please <Link to="/" className="orange">log in or register</Link> to send messages.</span> 
                : ''}
                
                {successMessageOpen ? <span className="message-sent-disclaimer">Message sent!</span> : ''}

                <div className="messages-section">
                    {sendMessageOpen 
                    ?  <div className="message-section">
                            <MessageForm 
                                classes = {classes} 
                                post = {post}
                                setSendMessageOpen = {setSendMessageOpen}
                                userToken = {userToken}
                                setMessageSent = {setMessageSent} />
                    </div>
                    : ''}

                    {/* RENDER MESSAGES */}
                    {userData._id === post.author._id
                    ? <div className = "post-view-messages">
                        <Button 
                            color="primary"
                            endIcon={<KeyboardArrowDown/>}
                            onClick={() => {
                                setMyMessagesOpen(!myMessagesOpen);
                            }}>{`Messages (${myMessages.length})`}</Button>
                    </div>
                    : ''
                    }

                    {myMessagesOpen
                    ? <Messages myMessages = {myMessages}/>
                    : ''}

                </div>

                <>
                    {deleteConfirmationOpen 
                    ? <DeleteConfirmation 
                        setDeleteConfirmationOpen = {setDeleteConfirmationOpen} 
                        post = {post}
                        userToken = {userToken}/> 
                    : ''}
                    {editorOpen 
                    ? <Editor
                        classes = {classes}
                        userToken = {userToken}
                        post = {post}
                        setEditorOpen = {setEditorOpen}/>
                    : ''}
                </>
                
            </div>
        </main>
    );
};

export default Post;