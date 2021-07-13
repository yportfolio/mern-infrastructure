import React, { useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import FollowGrid from "./../user/FollowGrid";
import PostList from "./../post/PostList";

const ProfileTabs = (props) => {
  const [tab, setTab] = useState(0);
  const handleTabChange = (event, value) => {
    setTab(value);
  };

  return (
    <div>
      <AppBar position="static" color="default">
        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Posts" />
          <Tab label="Followings" />
          <Tab label="Followers" />
        </Tabs>
      </AppBar>

      {tab === 0 && (
        <TableContainer>
          <PostList removeUpdate={props.removePostUpdate} posts={props.posts} />
        </TableContainer>
      )}
      {tab === 1 && (
        <TableContainer>
          <FollowGrid people={props.user.following} />
        </TableContainer>
      )}
      {tab === 2 && (
        <TableContainer>
          <FollowGrid people={props.user.followers} />
        </TableContainer>
      )}
    </div>
  );
};

ProfileTabs.propTypes = {
  user: PropTypes.object.isRequired,
  removePostUpdate: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired,
};

const TableContainer = (props) => {
  return (
    <Typography component="div" style={{ padding: 8 * 2 }}>
      {props.children}
    </Typography>
  );
};

TableContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProfileTabs;
