export interface User {
  id: string;
  email: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  author_email: string;
}