import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [postName, setPostName] = useState('');
  const [description, setDescription] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editPostName, setEditPostName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Make a POST request to create a new post
      const response = await axios.post('http://localhost:4000/api/posts', {
        postName,
        description
      });

      // Log the response data (you can handle it as needed)
      console.log('New post created:', response.data);

      // Clear input fields after successful creation
      setPostName('');
      setDescription('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditPostName(posts[index].postName);
    setEditDescription(posts[index].description);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    const updatedPosts = [...posts];
    updatedPosts[editIndex] = { postName: editPostName, description: editDescription };
    setPosts(updatedPosts);
    setEditIndex(null);
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditPostName('');
    setEditDescription('');
  };


  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:4000/api/posts/${postId}`);
      // Filter out the deleted post from the state
      setPosts(posts.filter(post => post.post_id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };


  return (
    <div className="App">
      <h1>Create a New Blog Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="postName">Post Name:</label>
          <input
            type="text"
            id="postName"
            value={postName}
            onChange={(e) => setPostName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      <div className="post-list">
        <h2>Posts</h2>
        <ul>
          {posts.map((post, index) => (
            <li key={index}>
              {editIndex === index ? (
                <form onSubmit={handleUpdate}>
                  <div className="form-group">
                    <label htmlFor="editPostName">Edit Post Name:</label>
                    <input
                      type="text"
                      id="editPostName"
                      value={editPostName}
                      onChange={(e) => setEditPostName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editDescription">Edit Description:</label>
                    <textarea
                      id="editDescription"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit">Update</button>
                  <button type="button" onClick={handleCancelEdit}>Cancel</button>
                </form>
              ) : (
                <>
                  <h3>{post.postName}</h3>
                  <p>{post.description}</p>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
