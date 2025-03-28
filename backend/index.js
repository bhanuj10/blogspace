const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.user = user; // Attach user info to the request object
    next();
  });
};

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Models
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Add name field
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author_email: { type: String, required: true },
  author_name: { type: String, required: true }, // Add author_name field
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);
const Blog = mongoose.model('Blog', BlogSchema);

// Routes
// Signup
app.get('/',async(req,res)=>{
  res.status(200).send("<h1>Backend is working fine<h1>")
})

app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body; // Accept name
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email:email.toLowerCase(), password: hashedPassword }); // Save name
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ error: 'User already exists or invalid data' });
  }
});

// Signin
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ email: user.email.toLowerCase() }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protect the Create Blog route
app.post('/api/blogs', authenticateToken, async (req, res) => {
  const { title, content, author_email } = req.body; // Accept author_email from the request body

  try {
    const user = await User.findOne({ email: author_email });
    if (!user) {
      return res.status(404).json({ error: 'Author not found' });
    }

    const newBlog = new Blog({
      title,
      content,
      author_email,
      author_name: user.name,
    });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create blog' });
  }
});

// Protect the Get Blogs route
app.get('/api/blogs', authenticateToken, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ created_at: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Protect the Delete Blog route
app.delete('/api/blogs/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const author_email = req.user.email.toLowerCase(); // Use email from the token

  try {
    const blog = await Blog.findOneAndDelete({ _id: id, author_email }); // Ensure the blog belongs to the user
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found or unauthorized' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const API_URL = 'http://localhost:5000/api';

// Helper function to get the token
const getToken = () => localStorage.getItem('token');

// Fetch Blogs
const fetchBlogs = async () => {
  const response = await fetch(`${API_URL}/blogs`, {
    headers: {
      Authorization: `Bearer ${getToken()}`, // Include token in the header
    },
  });
  if (!response.ok) throw new Error('Failed to fetch blogs');
  return response.json();
};

// Create Blog
const createBlog = async (title, content) => {
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
const deleteBlog = async (id) => {
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

// Export functions
module.exports = {
  fetchBlogs,
  createBlog,
  deleteBlog,
};