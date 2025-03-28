import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import { Trash2 } from 'lucide-react';
import { fetchBlogs, deleteBlog } from '../services/apiService';

export interface Blog {
  id: string; // Ensure this matches the `_id` field from MongoDB
  title: string;
  content: string;
  created_at: string;
  author_email: string; // Add this property to match the expected structure
  author_name?: string; // Add this property to match the expected structure
}

export default function MyPosts() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState('');
  const loggedInEmail = localStorage.getItem('email'); // Get the logged-in user's email

  useEffect(() => {
    fetchMyBlogs();
  }, []); // Empty dependency array ensures it runs only once

  const fetchMyBlogs = async () => {
    try {
      const data = await fetchBlogs();
      const formattedBlogs = data.map((blog: any) => ({
        ...blog,
        id: blog._id, // Map _id to id
        author_email: blog.author_email, // Ensure this field is included
      }));
      setBlogs(formattedBlogs);
    } catch (error: any) {
      setError('Failed to fetch blogs.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBlog(id); // Pass id as a string
      setBlogs(blogs.filter((blog) => blog.id !== id)); // Filter out the deleted blog
    } catch (error: any) {
      setError('Failed to delete the blog post.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Blog Posts</h1>
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="space-y-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white shadow sm:rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{blog.title}</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {format(new Date(blog.created_at), 'PPP')}
                    </p>
                  </div>
                  {blog.author_email.toLowerCase() === loggedInEmail?.toLowerCase() && (
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <p className="mt-4 text-gray-700 whitespace-pre-wrap">{blog.content}</p>
              </div>
            </div>
          ))}
          {blogs.length === 0 && (
            <p className="text-center text-gray-500">No blog posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}