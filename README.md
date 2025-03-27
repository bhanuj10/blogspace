
## **Steps to Set Up and Run the Project**

### **1. Clone the Repository**
If you haven't already cloned the repository, do so using the following command:
```bash
git clone <repository-url>
cd blogspace
```

---

### **2. Backend Setup**

#### **a. Navigate to the Backend Directory**
```bash
cd backend
```

#### **b. Install Dependencies**
Run the following command to install the required dependencies:
```bash
npm install
```

#### **c. Create a `.env` File**
Create a `.env` file in the backend directory with the following variables:
```env
MONGO_URI=mongodb://localhost:27017/blogspace
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

- **`MONGO_URI`**: The MongoDB connection string.
- **`PORT`**: The port on which the backend server will run.
- **`JWT_SECRET`**: A secret key for signing JSON Web Tokens (JWT). Replace `your_jwt_secret_key` with a secure random string.

#### **d. Start the Backend Server**
Run the following command to start the backend server:
```bash
node index.js
```

The backend server will start at `http://localhost:5000`.

---

### **3. Frontend Setup**

#### **a. Navigate to the Frontend Directory**
```bash
cd ../frontend
```

#### **b. Install Dependencies**
Run the following command to install the required dependencies:
```bash
npm install
```

#### **c. Start the Frontend Development Server**
Run the following command to start the frontend development server:
```bash
npm run dev
```

The frontend will start at `http://localhost:5173` (or another port if `5173` is already in use).

---

### **4. Access the Application**
- **Frontend**: Open your browser and navigate to `http://localhost:5173`.
- **Backend**: The backend API is available at `http://localhost:5000`.

---

### **5. Testing the Application**
- **Sign Up**: Create a new account using the signup page.
- **Sign In**: Log in with the created account.
- **Create Blog**: Create a new blog post.
- **View Blogs**: View all blogs on the home page.
- **Delete Blog**: Delete a blog post from "My Posts."

---

### **6. Additional Notes**
- Ensure MongoDB is running locally on your machine. If not, start MongoDB using the following command:
  ```bash
  mongod
  ```
- If you encounter any issues, check the logs in the terminal for both the frontend and backend.

---

Let me know if you need further assistance!