import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import { fetchBlogs as fetchBlogsFromApi } from '../services/apiService';

export interface Blog {
  id: number;
  title: string;
  content: string;
  author_email: string;
  author_name: string; // Add author_name
  created_at: string;
}

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await fetchBlogsFromApi();
      setBlogs(data);
    } catch (error: any) {
      setError('Failed to fetch blogs.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Latest Blog Posts</h1>
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="space-y-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white shadow sm:rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-xl font-semibold text-gray-900">{blog.title}</h2>
                <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                  <span>{blog.author_name}</span> {/* Display author name */}
                  <span>•</span>
                  <span>{format(new Date(blog.created_at), 'PPP p')}</span> {/* Display time */}
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