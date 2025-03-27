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
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body; // Accept name
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword }); // Save name
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Blog
app.post('/api/blogs', async (req, res) => {
  const { title, content, author_email } = req.body;
  try {
    const user = await User.findOne({ email: author_email }); // Fetch user details
    if (!user) {
      return res.status(404).json({ error: 'Author not found' });
    }
    const newBlog = new Blog({
      title,
      content,
      author_email,
      author_name: user.name, // Add author_name
    });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create blog' });
  }
});

// Get Blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ created_at: -1 }); // Sort by created_at descending
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Delete Blog
app.delete('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByIdAndDelete(id); // Use Mongoose's findByIdAndDelete
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});