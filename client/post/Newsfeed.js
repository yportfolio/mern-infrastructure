import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import NewPost from "./NewPost";
import PostList from "./PostList";
import auth from "../auth/auth-helper";
import { listNewsFeed } from "./api-post.js";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: "auto",
    paddingTop: 0,
    paddingBottom: theme.spacing(3),
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.openTitle,
    fontSize: "1em",
  },
  media: {
    mediaHeight: 330,
  },
}));

export default function Newsfeed() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listNewsFeed({ userId: jwt.user._id }, { t: jwt.token }, signal).then(
      (data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setPosts(data);
        }
      }
    );
    return () => {
      abortController.abort();
    };
  }, []);

  const addPost = (post) => {
    const updatedPosts = [...posts];
    updatedPosts.unshift(post);
    setPosts(updatedPosts);
  };

  const removePost = (post) => {
    const undatedPosts = [...posts];
    const index = undatedPosts.indexOf(post);
    undatedPosts.splice(index, 1);
    setPosts(undatedPosts);
  };

  return (
    <Card className={classes.card}>
      <Typography type="title" className={classes.title}>
        Newsfeed
      </Typography>
      <Divider />
      <NewPost addUpdate={addPost} />
      <Divider />
      <PostList posts={posts} removeUpdate={removePost} />
    </Card>
  );
}
