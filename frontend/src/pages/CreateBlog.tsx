import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { createBlog } from '../services/apiService';

export default function CreateBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const author_email = localStorage.getItem('email'); // Fetch email from localStorage
      await createBlog(title, content, author_email || '');
      navigate('/my-posts');
    } catch (error: any) {
      setError('An error occurred while creating the blog.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Blog Post</h1>
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  id="content"
                  rows={8}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}