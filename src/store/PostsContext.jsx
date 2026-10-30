import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { createArticle, getArticle, listArticles, updateArticle } from '../lib/api';

const PostsContext = createContext(null);

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listArticles({ offset: 0, limit: 1000 });
      setPosts(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function getPost(id) {
    return posts.find((p) => String(p.id) === String(id));
  }

  async function fetchPost(id) {
    const data = await getArticle(id);
    if (data) {
      setPosts((prev) => {
        const exists = prev.some((p) => String(p.id) === String(data.id));
        if (exists) return prev.map((p) => (String(p.id) === String(data.id) ? data : p));
        return [data, ...prev];
      });
    }
    return data;
  }

  async function savePost({ id, title, content, category, status }) {
    if (id) {
      await updateArticle(id, { title, content, category, status });
    } else {
      await createArticle({ title, content, category, status });
    }
    await refresh();
  }

  async function trashPost(id) {
    const post = getPost(id);
    if (!post) throw new Error('article not found');
    await updateArticle(id, {
      title: post.title,
      content: post.content,
      category: post.category,
      status: 'trash',
    });
    await refresh();
  }

  return (
    <PostsContext.Provider
      value={{ posts, loading, error, refresh, getPost, fetchPost, savePost, trashPost }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePosts must be used within PostsProvider');
  return ctx;
}
