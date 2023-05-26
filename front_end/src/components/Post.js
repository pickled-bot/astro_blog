import React from 'react';
import PropTypes from 'prop-types';
import "../style/post.css";

const Post = ({postid, date, title, body, onSelectPost, onDelete}) => {
  const onTitleClick = () => {
    onSelectPost(postid, date, title, body);
  }

  const onClickRemove = () => {
    onDelete(postid);
  }
  
  return (
    <section className = "Post">
      <h2 onClick = {onTitleClick}> {date} : {title}</h2>
      <p>{body}</p>
      <button onClick={onClickRemove} className="deleteButton">delete</button>
    </section>
  );
};


Post.propTypes = {
  postid: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  onSelectPost: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Post;