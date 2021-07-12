import React from "react";
import PropTypes from "prop-types";
import Post from "./Post";

//TODO replace index with uuid
function PostList(props) {
  return (
    <div style={{ margin: "24px" }}>
      {props.posts.map((post, index) => {
        return <Post post={post} key={index} onRemove={props.removeUpdate} />;
      })}
    </div>
  );
}

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  removeUpdate: PropTypes.func.isRequired,
};

export default PostList;
