import { useSearchParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Pagination,
  Typography,
} from '@mui/material';
import { usePosts } from '../store/PostsContext';

const PAGE_SIZE = 5;

export default function Preview() {
  const { posts, loading, error, refresh } = usePosts();
  const [searchParams, setSearchParams] = useSearchParams();

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

  const published = posts
    .filter((p) => p.status === 'publish')
    .sort((a, b) => Number(b.id) - Number(a.id));

  if (published.length === 0) {
    return <Typography>No published articles</Typography>;
  }

  const pageCount = Math.max(1, Math.ceil(published.length / PAGE_SIZE));
  const rawPage = parseInt(searchParams.get('page') ?? '1', 10);
  const page = Number.isNaN(rawPage) ? 1 : Math.min(Math.max(rawPage, 1), pageCount);

  const visible = published.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handlePage(_, value) {
    setSearchParams(value === 1 ? {} : { page: String(value) });
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Preview
      </Typography>
      {visible.map((post) => (
        <Card key={post.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{post.title}</Typography>
            <Chip label={post.category} size="small" sx={{ mb: 1 }} />
            <Typography sx={{ whiteSpace: 'pre-line' }}>{post.content}</Typography>
          </CardContent>
        </Card>
      ))}
      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination count={pageCount} page={page} onChange={handlePage} />
        </Box>
      )}
    </Box>
  );
}
