import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token'); // Remove JWT token
    localStorage.removeItem('email'); // Remove email
    navigate('/signin');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/home" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-indigo-600" />
              <span className="font-bold text-xl text-gray-800">BlogSpace</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/create" className="text-gray-600 hover:text-indigo-600">Create Post</Link>
            <Link to="/my-posts" className="text-gray-600 hover:text-indigo-600">My Posts</Link>
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-indigo-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}