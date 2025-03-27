const API_URL = 'http://localhost:5000/api';

export const fetchBlogs = async () => {
  const response = await fetch(`${API_URL}/blogs`);
  if (!response.ok) throw new Error('Failed to fetch blogs');
  return response.json();
};

export const createBlog = async (title: string, content: string, author_email: string) => {
  const response = await fetch(`${API_URL}/blogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, author_email }),
  });
  if (!response.ok) throw new Error('Failed to create blog');
  return response.json();
};

export const deleteBlog = async (id: string) => {
  const response = await fetch(`http://localhost:5000/api/blogs/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete blog');
  }
};