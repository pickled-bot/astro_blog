import React from 'react';
import PropTypes from 'prop-types';
import Post from './Post.js';
import '../style/postList.css';

const PostList = ({posts, onSelectPost}) => {
  if (!posts) return <div>loading...</div>;
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
  return <section className="PostList">{postComponents}</section>;
};

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  onSelectPost: PropTypes.func.isRequired,
};

export default PostList; 