import { useState } from 'react';
import { Alert, Box, Button, TextField } from '@mui/material';

export const RULES = {
  title: { min: 20, max: 60 },
  content: { min: 200, max: 800 },
  category: { min: 3, max: 30 },
};

function checkLength(value, { min, max }, label) {
  const len = value.trim().length;
  if (!len) return `${label} is required`;
  if (len < min) return `${label} must be at least ${min} characters`;
  if (len > max) return `${label} must be at most ${max} characters`;
  return '';
}

export default function PostForm({ initialValues, onSubmit, serverError = '', saving = false }) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [content, setContent] = useState(initialValues?.content ?? '');
  const [category, setCategory] = useState(initialValues?.category ?? '');
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {
      title: checkLength(title, RULES.title, 'Title'),
      content: checkLength(content, RULES.content, 'Content'),
      category: checkLength(category, RULES.category, 'Category'),
    };
    const filtered = Object.fromEntries(Object.entries(next).filter(([, v]) => v));
    setErrors(filtered);
    return Object.keys(filtered).length === 0;
  }

  async function handleSubmit(status) {
    if (!validate()) return;
    await onSubmit(
      { title: title.trim(), content: content.trim(), category: category.trim() },
      status,
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 640 }}>
      {serverError ? <Alert severity="error">{serverError}</Alert> : null}
      <TextField
        label={`Title (${RULES.title.min}-${RULES.title.max} characters)`}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={Boolean(errors.title)}
        helperText={errors.title}
        disabled={saving}
      />
      <TextField
        label={`Content (${RULES.content.min}-${RULES.content.max} characters)`}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        multiline
        minRows={6}
        error={Boolean(errors.content)}
        helperText={errors.content}
        disabled={saving}
      />
      <TextField
        label={`Category (${RULES.category.min}-${RULES.category.max} characters)`}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        error={Boolean(errors.category)}
        helperText={errors.category}
        disabled={saving}
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" onClick={() => handleSubmit('publish')} disabled={saving}>
          Publish
        </Button>
        <Button variant="outlined" onClick={() => handleSubmit('draft')} disabled={saving}>
          Draft
        </Button>
      </Box>
    </Box>
  );
}
