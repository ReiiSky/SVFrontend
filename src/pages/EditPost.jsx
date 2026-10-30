import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { CircularProgress, Typography } from '@mui/material';
import PostForm from '../components/PostForm';
import { usePosts } from '../store/PostsContext';

export default function EditPost() {
  const { id } = useParams();
  const { getPost, fetchPost, savePost, loading: listLoading } = usePosts();
  const navigate = useNavigate();
  const [post, setPost] = useState(() => getPost(id));
  const [detailLoading, setDetailLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [serverError, setServerError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const cached = getPost(id);
    if (cached) {
      setPost(cached);
      return;
    }
    if (listLoading) return;
    setDetailLoading(true);
    fetchPost(id)
      .then((data) => {
        if (data) setPost(data);
        else setNotFound(true);
      })
      .catch((e) => {
        if (e.message === 'article not found') setNotFound(true);
        else setServerError(e.message);
      })
      .finally(() => setDetailLoading(false));
  }, [id, listLoading, getPost, fetchPost]);

  if (notFound) {
    return <Navigate to="/posts" replace state={{ notFoundId: id }} />;
  }

  if (!post || detailLoading || listLoading) {
    return <CircularProgress />;
  }

  async function handleSubmit(values, status) {
    setSaving(true);
    setServerError('');
    try {
      await savePost({ id, ...values, status });
      navigate('/posts');
    } catch (e) {
      if (e.message === 'article not found') setNotFound(true);
      else setServerError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Edit Post
      </Typography>
      <PostForm
        key={post.id}
        initialValues={{ title: post.title, content: post.content, category: post.category }}
        onSubmit={handleSubmit}
        serverError={serverError}
        saving={saving}
      />
    </>
  );
}
