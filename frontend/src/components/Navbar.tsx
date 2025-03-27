import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PenSquare, BookOpen, LogOut } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    // Simulate sign-out
    console.log('User signed out');
    navigate('/signin');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-indigo-600" />
              <span className="font-bold text-xl text-gray-800">BlogSpace</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/create" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600">
              <PenSquare className="h-5 w-5" />
              <span>Create Post</span>
            </Link>
            <Link to="/my-posts" className="text-gray-600 hover:text-indigo-600">My Posts</Link>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}