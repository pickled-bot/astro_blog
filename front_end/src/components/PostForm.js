import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "../style/postForm.css";

const kDefaultFormState = {
  title: '',
  body: '',
};

const PostForm = ({onAddPost}) => {
  const [formData, setFormData] = useState(kDefaultFormState);

  const onInput = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    const newFormData = {...formData, [fieldName]: fieldValue};
    setFormData(newFormData);
  };

  let titleValError = formData.title.length > 0 
    ? ""
    : "title must not be empty";
  let bodyValError = formData.body.length > 0 ? "" : "body must not be empty";

  const handleSubmit = (event) => {
    event.preventDefault();
    if (titleValError.length === 0 && bodyValError.length === 0) {
      onAddPost(formData);
    }
      setFormData(kDefaultFormState);
  };

  return (
    <form className="PostForm" onSubmit={handleSubmit}>
      <h2>Add a Post</h2>
      <div className="PostForm__error">{titleValError}</div>
      <h3>title</h3>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={onInput}
        ></input>
        <h4>body</h4>
        <div className="PostForm__error">{bodyValError}</div>
        <textarea
          name="body"
          value={formData.body}
          onChange={onInput}
          ></textarea>
          <label for="auth-token">password pls:</label>
        <input type="text" id="auth-token" name="auth-token"></input>
          <button type="submit">Add Post</button>

    </form>
  );
};

PostForm.propTypes = {
  onAddPost: PropTypes.func.isRequired,
};

export default PostForm;
        


