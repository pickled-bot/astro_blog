import React from 'react';
import PropTypes from 'prop-types';
import Post from './Post';
import '../style/PostList.css';

const PostList = ({posts, onSelectPost}) => {
  const postComponents = posts.map((post) => {
    return (
      <Post
        key = {post.postid}
        postid = {post.postid}
        date = {post.date}
        title = {post.title}
        body = {post.body}
        onSelectPost = {onSelectPost}
      />
    );
  });
  return <selection className="PostList">{postComponents}</selection>;
};

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  onSelectPost: PropTypes.func.isRequired,
};

export default PostList; 