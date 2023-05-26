import React, { useState, useEffect } from 'react';
import './App.css';
import PostList from './components/PostList';
import PostForm from './components/PostForm';

const baseUrl = "http://localhost:8080";

const postApiToJson = (post) => {
  const { date, title, body, post_id: postid } = post;
  return { date, title, body, postid };
};

    
const getPostData = async () => {
  try {
    const response = await fetch(`${baseUrl}/posts`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data.map(postApiToJson);
  } catch (error) {
    console.log(error);
  }
};

const sortPostData = (unsortedPosts, sortType) => {
  const unsortedPostsCopy = [...unsortedPosts];
  if (sortType === "date old-new") {
    const dateDescending = unsortedPostsCopy.sort(
      (a, b) => a.date < b.date
    );
    return dateDescending;
  } else if (sortType === "date new-old") {
    const dateAscending = unsortedPostsCopy.sort((a, b) => a.date > b.date);
    return dateAscending;
  } else if (sortType === "title a-z") {
    const titleAscending = unsortedPostsCopy.sort((a, b) => a.title > b.title);
    return titleAscending;
  } else if (sortType === "title z-a") {
    const titleDescending = unsortedPostsCopy.sort(
      (a, b) => a.title < b.title
    );
    return titleDescending;
  }
};


function App() {
  const [postData, setPostData] = useState([]);
  let [postNum, setPostNum] = useState(0);
  let [postTitle, setPostTitle] = useState("");
  
  useEffect(() => {
    loadPosts();
  }, []);


  const loadPosts = async () => {
    try {
      const posts = await getPostData();
      setPostData(posts);
    } catch (error) {
      console.log(error);
    }
  };

  const updatePostData = (updatedPost) => {
    return fetch(`${baseUrl}/posts/${updatedPost.postid}`, { 
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPost)
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .catch((error) => console.log(error));
  };


  const handlePost = (postid, title) => {
    const newNum = postid;
    const newTitle = title;
    
    setPostNum(newNum);
    setPostTitle(newTitle);
  };

  const onPostDelete = (postid) => {
    return fetch(`${baseUrl}/posts/${postid}`, {
      method: 'DELETE'
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      setPostData(postData.filter((post) => post.postid !== postid));
      return response.json();
    })
    .catch((error) => console.log(error));
  };

  const addPostData = (addedPost) => {
    const requestBody = { ...addedPost };

    return fetch(`${baseUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      .then(() => loadPosts())
      .catch((error) => console.log(error));
  };

  const handlePostDataReady = (postName) => {
    addPostData(postName)
      .then((newPost) => {
        loadPosts();
      })
      .catch((error) => console.log(error));
  };
  
  const handleSortSelection = (sortSelection) => {
    const sortType = sortSelection.target.value;
    const sortedPosts = sortPostData(postData, sortType);
    setPostData(sortedPosts);
  };

  return (
    <div className="App">
      <header>
        <h1>astro blog</h1>
      </header>

      <main>
        <div className="postContainer">
          <PostForm
          onAddPost={handlePostDataReady}
          ></PostForm>
        {/* add sort here */}
        <h4>{postTitle}</h4>
          <PostList posts={postData} onSelectPost={handlePost} onDelete={onPostDelete} />
        </div>
      </main>
    </div>
  );
}

export default App;
