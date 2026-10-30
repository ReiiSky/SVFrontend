import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import AddPost from './pages/AddPost';
import AllPosts from './pages/AllPosts';
import EditPost from './pages/EditPost';
import Preview from './pages/Preview';
import { PostsProvider } from './store/PostsContext';

export default function App() {
  return (
    <PostsProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/posts" replace />} />
        <Route element={<Layout />}>
          <Route path="/posts" element={<AllPosts />} />
          <Route path="/posts/new" element={<AddPost />} />
          <Route path="/posts/:id/edit" element={<EditPost />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="*" element={<Navigate to="/posts" replace />} />
        </Route>
      </Routes>
    </PostsProvider>
  );
}
