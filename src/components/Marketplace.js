import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {API_POSTS, apiRequest} from './api/index';
import './Marketplace.css';

// IMAGE IMPORTS
import marketplace from './site-images/marketplace.png';

// MUI IMPORTS
import { Button, 
        Checkbox,
        FormControl, 
        FormControlLabel,
        InputLabel,
        OutlinedInput, 
        InputAdornment,
        IconButton, 
        Typography} from '@material-ui/core';       
import { Add, Close, ArrowForwardIos, Search } from '@material-ui/icons';

// SUB-COMPONENTS
const NewPostForm = ({classes, userToken, setNewPostActive}) => {
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [willDeliver, setWillDeliver] = useState(false);
    
    const handleNewPostSubmit = async (event) => {
        event.preventDefault();

        const newPost = await apiRequest({
            url: API_POSTS,
            method: 'POST',
            body: {
                post: {
                    title: title,
                    description: description,
                    price: price,
                    location: location,
                    willDeliver: willDeliver, 
                },
            },
            token: userToken,
        });

        setNewPostActive(false);
        window.location.reload();
        return(false);
    };

    return (
        <form 
            className="new-post-form" 
            onSubmit={handleNewPostSubmit}>
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
                    type="submit"
                    variant="contained"
                    className={classes.mediumButton}
                    size="large" 
                    color="primary"
                    >POST</Button>
        </form>
    );
};

const PostList = ({history, getPostDate, postsToDisplay}) => {
    return (
        <>
            {postsToDisplay.map((post) => {
                 return (
                     <div 
                        className="post" 
                        key={post._id}
                        onClick={() => {
                            history.push(`/marketplace/${post._id}`)
                        }}>
                         <div className="post-header">
                             <div className="post-title-container">
                                <h1>{post.title}</h1>
                                <h2>{post.price}</h2>
                            </div>
                            <h3>{post.author.username}</h3>
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
                 )
             })}
        </>
    );
};


// DEFAULT COMPONENT
const Marketplace = ({classes, userToken, posts, getPostDate}) => {
    const history = useHistory();
    const [newPostActive, setNewPostActive] = useState(false);
    const [query, setQuery] = useState('');

    const queryMatch = (post, string) => {
        if (post.title.toLowerCase().includes(string.toLowerCase()) 
            || post.description.toLowerCase().includes(string.toLowerCase())
            || post.price.toLowerCase().includes(string.toLowerCase())
            || post.location.toLowerCase().includes(string.toLowerCase())
            || post.author.username.toLowerCase().includes(string.toLowerCase())) {
                return true;
        } else if (string.toLowerCase() === 'deliver' && post.willDeliver
                || string.toLowerCase() === 'delive' && post.willDeliver
                || string.toLowerCase() === 'deliv' && post.willDeliver
                || string.toLowerCase() === 'deli' && post.willDeliver
                || string.toLowerCase() === 'del' && post.willDeliver
                || string.toLowerCase() === 'de' && post.willDeliver
                || string.toLowerCase() === 'd' && post.willDeliver) {
            return true;
        } else {
            return false;
        };
    };

    const filteredPosts = posts.filter((post) => queryMatch(post, query));
    const postsToDisplay = query.length ? filteredPosts : posts;

    return (
        <main id="marketplace">    
            <section className="marketplace-container">
                <div className="marketplace-header-container">
                    <h1><img className="marketplace-header" src={marketplace} alt="Stranger's Things Marketplace"/></h1>
                    <Button
                        variant="contained"
                        disabled={userToken ? false : true}
                        className={classes.mediumButton}
                        size="large"
                        color="primary"
                        endIcon={<Add />}
                        onClick={() => {
                            setNewPostActive(true);
                        }}
                        >New Post</Button>
                </div>
                
                <div className="search">
                    <FormControl fullWidth variant="outlined" className={classes.searchBar}>
                        <OutlinedInput 
                            color="primary"
                            id="searchbar"
                            size="small"
                            placeholder="Search posts..."
                            className={classes.searchBar}
                            value={query}
                            onChange={(event) => {setQuery(event.target.value)}}
                            startAdornment={<Search color="primary" className="searchIcon" />}
                            />
                        </FormControl>                  
                </div>

                <div className="post-board">
                    <div className="matches">Matches: <span className="orange">{postsToDisplay.length}</span></div>
                    <PostList 
                        history = {history}
                        getPostDate = {getPostDate}
                        postsToDisplay = {postsToDisplay}/>
                </div>

            </section>

            {newPostActive
            ? <section className="new-post">
                
                <div className="new-post-header">
                    <Typography variant="h3"><span className="orange">new</span> post</Typography>
                    <IconButton 
                        size="large"
                        onClick={() => setNewPostActive(false)}
                        >{<Close color="primary" size="large" fontSize="large"/>}</IconButton>
                </div>

                <NewPostForm 
                    classes = {classes} 
                    userToken = {userToken}
                    setNewPostActive = {setNewPostActive}/>

            </section>
            : ''}

        </main>
    );
};

export default Marketplace;