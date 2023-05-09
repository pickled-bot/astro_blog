import React from 'react';
import PropTypes from 'prop-types';
import "../style/Board.css";

const Post = ({postid, date, title, body, onSelectPost}) => {
  const onTitleClick = () => {
    onSelectPost(postid, title);
  }
  
  return (
    <section className = "Post">
      <h2 onClick = {onTitleClick}>{title}</h2>
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