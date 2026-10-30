import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { usePosts } from '../store/PostsContext';

export default function AllPosts() {
  const [tab, setTab] = useState('publish');
  const { posts, loading, error, refresh, trashPost } = usePosts();
  const navigate = useNavigate();
  const [trashError, setTrashError] = useState('');

  const filtered = posts.filter((p) => p.status === tab);

  async function handleTrash(id) {
    setTrashError('');
    try {
      await trashPost(id);
    } catch (e) {
      setTrashError(e.message);
    }
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={refresh}>
          Retry
        </Button>
      </>
    );
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        All Posts
      </Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab value="publish" label="Published" />
        <Tab value="draft" label="Drafts" />
        <Tab value="trash" label="Trashed" />
      </Tabs>
      {trashError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {trashError}
        </Alert>
      ) : null}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No articles
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    <IconButton aria-label="edit" onClick={() => navigate(`/posts/${post.id}/edit`)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="trash"
                      onClick={() => handleTrash(post.id)}
                      disabled={tab === 'trash'}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
