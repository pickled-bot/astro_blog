import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
// import Post from './components/Post';
import PostList from './components/PostList';

const baseUrl = "http://localhost:8080";

const postApiToJson = (post) => {
  const { date, title, body, post_id: postid } = post;
  return { date, title, body, postid };
};

// consider something other than axios, what next.js uses
// const getPostData = () => {
//   return axios
//     .get(`${baseUrl}/posts`)
//     .then((response) => { 
  //       return response.data.map(postApiToJson);
  //     })
  //     .catch((error) => {
    //       console.log(error);
    //     });
    // };
    
const getPostData = async () => {
  try {
    const response = await axios.get(`${baseUrl}/posts`);
    return response.data.map([postApiToJson]);
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
    return axios
    .patch(`${baseUrl}/posts/${updatedPost.postid}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
    console.log(error);
    });
  };


  const handlePost = (postid, title) => {
    const newNum = postid;
    const newTitle = title;
    
    setPostNum(newNum);
    setPostTitle(newTitle);
  };

  const onPostDelete = (postid) => {
    return axios
    .delete(`${baseUrl}/posts/${postid}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  };

  const addPostData = (addedPost) => {
    const requestBody = { ...addedPost };

    return axios
      .post(`${baseUrl}/posts`, requestBody)
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
        <div>
        {/* add sort here */}
        <h4>{postTitle}</h4>
          <PostList posts={postData} onSelectPost={handlePost} />
        </div>
      </main>
    </div>
  );
}

export default App;
