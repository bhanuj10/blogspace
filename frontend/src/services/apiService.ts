
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get the token from localStorage
const getToken = () => localStorage.getItem('token');

// Fetch Blogs
export const fetchBlogs = async () => {
  const response = await fetch(`${API_URL}/blogs`, {
    headers: {
      Authorization: `Bearer ${getToken()}`, // Include token in the header
    },
  });
  if (!response.ok) throw new Error('Failed to fetch blogs');
  return response.json();
};

// Create Blog
export const createBlog = async (title: string, content: string) => {
  const response = await fetch(`${API_URL}/blogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`, // Include token in the header
    },
    body: JSON.stringify({ title, content }),
  });
  if (!response.ok) throw new Error('Failed to create blog');
  return response.json();
};

// Delete Blog
export const deleteBlog = async (id: string) => {
  const response = await fetch(`${API_URL}/blogs/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`, // Include token in the header
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete blog');
  }
};