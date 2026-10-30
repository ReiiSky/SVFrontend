import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import PostForm from '../components/PostForm';
import { usePosts } from '../store/PostsContext';

export default function AddPost() {
  const { savePost } = usePosts();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(values, status) {
    setSaving(true);
    setServerError('');
    try {
      await savePost({ ...values, status });
      navigate('/posts');
    } catch (e) {
      setServerError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Add New
      </Typography>
      <PostForm onSubmit={handleSubmit} serverError={serverError} saving={saving} />
    </>
  );
}
