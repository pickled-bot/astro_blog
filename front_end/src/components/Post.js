import React from 'react';
import PropTypes from 'prop-types';
import "../style/post.css";

const Post = ({postid, date, title, body, onSelectPost}) => {
  const onTitleClick = () => {
    onSelectPost(postid, date, title, body);
  }
  
  return (
    <section className = "Post">
      <h2 onClick = {onTitleClick}> {date} : {title}</h2>
      <p>{body}</p>
    </section>
  );
};


Post.propTypes = {
  postid: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  onSelectPost: PropTypes.func.isRequired,
};

export default Post;